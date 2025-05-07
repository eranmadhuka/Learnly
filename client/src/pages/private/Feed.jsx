import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PostCard from "../../components/posts/PostCard";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
    console.log("Using API URL:", apiUrl);

    const fetchFeedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.following || user.following.length === 0) {
          setPosts([]);
          return;
        }

        // Fetch posts from users the current user follows
        const response = await axios.get(`${apiUrl}/posts`, {
          withCredentials: true,
          params: {
            userIds: user.following.join(","), // Assuming backend supports filtering by user IDs
          },
        });

        console.log("Feed API response:", response.data);
        const fetchedPosts = Array.isArray(response.data) ? response.data : [];
        setPosts(fetchedPosts);
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
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedPosts = async () => {
      if (user) {
        try {
          // Update to match backend endpoint (assuming an endpoint exists for saved posts)
          const response = await axios.get(
            `${apiUrl}/posts/users/${user.id}/saved`,
            {
              withCredentials: true,
            }
          );
          const saved = Array.isArray(response.data) ? response.data : [];
          setSavedPosts(saved);
        } catch (err) {
          console.error(
            "Error fetching saved posts:",
            err.response || err.message
          );
          setSavedPosts([]);
        }
      }
    };

    fetchFeedPosts();
    fetchSavedPosts();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8 text-start">
          <h1 className="text-3xl font-bold text-gray-900">Your Feed</h1>
          <p className="mt-2 text-lg text-gray-600">
            Latest posts from people you follow
          </p>
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

        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No posts available. Follow users to see their posts!
          </div>
        )}

        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col">
              <PostCard
                post={post}
                posts={posts}
                setPosts={setPosts}
                savedPosts={savedPosts}
                setSavedPosts={setSavedPosts}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;
