import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PostCard from "../../components/posts/PostCard";
import { Search, PlusCircle } from "lucide-react";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

    const fetchFeedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.following || user.following.length === 0) {
          setPosts([]);
          return;
        }

        // Fetch posts from users the current user follows
        const response = await axios.get(`${apiUrl}/api/posts`, {
          withCredentials: true,
          params: {
            userIds: user.following.join(","), // Assuming backend supports filtering by user IDs
          },
        });

        // console.log("Feed API response:", response.data);
        const fetchedPosts = Array.isArray(response.data) ? response.data : [];
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (err) {
        console.error(
          "Error fetching feed posts:",
          err.response || err.message
        );
        setError(
          err.response?.status === 404
            ? "No posts found from followed users."
            : "Failed to load feed. Please try again later."
        );
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedPosts();
  }, [user]);

  useEffect(() => {
    // Filter posts based on search query
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author?.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Title, Search and Add Post Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">Your Feed</h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Add Post Button */}
            <Link
              to="/posts/new"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>Add Post</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {loading && (
          <div className="text-center text-gray-500 py-12">
            Loading posts...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-12">
            {error}
            <button
              className="ml-2 text-blue-500 hover:underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && searchQuery && (
          <div className="text-center text-gray-500 py-12">
            No posts found matching "{searchQuery}"
          </div>
        )}

        {!loading && !error && posts.length === 0 && !searchQuery && (
          <div className="text-center text-gray-500 py-12">
            No posts available. Follow users to see their posts!
          </div>
        )}

        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="flex flex-col">
              <PostCard post={post} posts={filteredPosts} setPosts={setPosts} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;
