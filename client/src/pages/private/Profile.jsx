import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfile from "../../components/profile/EditProfile";

const Profile = () => {
  const { user: currentUser, logout } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    picture: "",
    isPrivate: false,
    file: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = isOwnProfile
          ? `${API_BASE_URL}/api/users/me`
          : `${API_BASE_URL}/api/users/${userId}`;
        const response = await axios.get(endpoint, { withCredentials: true });
        const userData = response.data;
        setProfileUser(userData);
        setFormData({
          name: userData.name || "",
          bio: userData.bio || "",
          picture: userData.picture || "",
          isPrivate: userData.isPrivate || false,
          file: null,
        });

        if (
          !userData.isPrivate ||
          isOwnProfile ||
          (currentUser && userData.followers.includes(currentUser.id))
        ) {
          fetchFollowers(userData.id);
          fetchFollowing(userData.id);
          fetchPosts(userData.id);
        }

        if (!isOwnProfile && currentUser) {
          setIsFollowing(userData.followers.includes(currentUser.id));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (err.response?.status === 404) navigate("/not-found");
      }
    };

    if (currentUser || userId) fetchProfile();
  }, [currentUser, userId, navigate]);

  const fetchFollowers = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/${id}/followers`,
        { withCredentials: true }
      );
      setFollowers(response.data);
    } catch (err) {
      console.error("Failed to fetch followers:", err);
    }
  };

  const fetchFollowing = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/${id}/following`,
        { withCredentials: true }
      );
      setFollowing(response.data);
    } catch (err) {
      console.error("Failed to fetch following:", err);
    }
  };

  const fetchPosts = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/posts?userId=${id}`,
        { withCredentials: true }
      );
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        params: { name: query },
        withCredentials: true,
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(true);
      fetchFollowers(userId);
      if (!profileUser.isPrivate) fetchPosts(userId);
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/unfollow/${userId}`, {
        withCredentials: true,
      });
      setIsFollowing(false);
      fetchFollowers(userId);
      if (profileUser.isPrivate) {
        setPosts([]);
        setFollowers([]);
        setFollowing([]);
      }
    } catch (err) {
      console.error("Failed to unfollow user:", err);
    }
  };

  const handleEditProfile = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/me`, formData, {
        withCredentials: true,
      });
      setIsEditing(false);
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        withCredentials: true,
      });
      setProfileUser(response.data);
      setFormData({
        name: response.data.name,
        bio: response.data.bio,
        picture: response.data.picture,
        isPrivate: response.data.isPrivate,
        file: null,
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/api/users/me`, {
          withCredentials: true,
        });
        logout();
        navigate("/login");
      } catch (err) {
        console.error("Failed to delete profile:", err);
      }
    }
  };

  const handleAddPost = () => {
    navigate("/posts/new");
  };

  if (!currentUser && !userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
          Please login to view this page
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-amber-700 p-8 text-white">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={profileUser.picture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                    {profileUser.isPrivate && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-amber-100 mt-1">{profileUser.email}</p>
                  {profileUser.bio && (
                    <p className="mt-2 text-amber-200 max-w-md">
                      {profileUser.bio}
                    </p>
                  )}
                </div>
                {!isOwnProfile && currentUser && (
                  <div className="mt-4 md:mt-0">
                    {isFollowing ? (
                      <button
                        onClick={handleUnfollow}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center space-x-8 px-6 py-4 bg-gray-50">
              <div className="text-center">
                <span className="block text-2xl font-bold text-amber-700">
                  {posts.length}
                </span>
                <span className="text-gray-600">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-amber-700">
                  {followers.length}
                </span>
                <span className="text-gray-600">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-amber-700">
                  {following.length}
                </span>
                <span className="text-gray-600">Following</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 text-center font-medium text-lg ${
                  activeTab === "posts"
                    ? "text-amber-700 border-b-2 border-amber-700"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium text-lg ${
                  activeTab === "followers"
                    ? "text-amber-700 border-b-2 border-amber-700"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() => setActiveTab("followers")}
              >
                Followers
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium text-lg ${
                  activeTab === "following"
                    ? "text-amber-700 border-b-2 border-amber-700"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() => setActiveTab("following")}
              >
                Following
              </button>
              {isOwnProfile && (
                <button
                  className={`flex-1 py-4 text-center font-medium text-lg ${
                    activeTab === "settings"
                      ? "text-amber-700 border-b-2 border-amber-700"
                      : "text-gray-600 hover:text-amber-700"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Posts Tab */}
              {activeTab === "posts" && (
                <div>
                  {isOwnProfile ? (
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Your Posts
                      </h2>
                      <button
                        onClick={handleAddPost}
                        className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        New Post
                      </button>
                    </div>
                  ) : (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      {profileUser.name}'s Posts
                    </h2>
                  )}
                  {profileUser.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="text-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600 mt-4">
                        This account is private. Follow to see their posts.
                      </p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No posts yet.</p>
                      {isOwnProfile && (
                        <button
                          onClick={handleAddPost}
                          className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
                        >
                          Create Your First Post
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mt-2 line-clamp-3">
                            {post.content}
                          </p>
                          <p className="text-sm text-gray-500 mt-3">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          {isOwnProfile && (
                            <div className="flex justify-end space-x-2 mt-3">
                              <button className="text-amber-600 hover:text-amber-700 text-sm">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-700 text-sm">
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Followers Tab */}
              {activeTab === "followers" && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Followers
                  </h2>
                  {profileUser.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="text-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600 mt-4">
                        This account is private. Follow to see their followers.
                      </p>
                    </div>
                  ) : followers.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">
                      No followers yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {followers.map((follower) => (
                        <div
                          key={follower.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                follower.picture ||
                                "https://via.placeholder.com/40"
                              }
                              alt={follower.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {follower.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {follower.email}
                              </p>
                            </div>
                          </div>
                          {isOwnProfile && (
                            <button
                              onClick={() =>
                                navigate(`/profile/${follower.id}`)
                              }
                              className="px-4 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
                            >
                              View
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Following Tab */}
              {activeTab === "following" && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Following
                  </h2>
                  {profileUser.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="text-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600 mt-4">
                        This account is private. Follow to see who they follow.
                      </p>
                    </div>
                  ) : following.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">
                      Not following anyone yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {following.map((followed) => (
                        <div
                          key={followed.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                followed.picture ||
                                "https://via.placeholder.com/40"
                              }
                              alt={followed.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {followed.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {followed.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/profile/${followed.id}`)}
                            className="px-4 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab (Own Profile Only) */}
              {activeTab === "settings" && isOwnProfile && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Settings
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Profile Information
                      </h3>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Account Actions
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={logout}
                          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Sign Out
                        </button>
                        <button
                          onClick={handleDeleteProfile}
                          className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-200 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile Modal */}
          {isEditing && isOwnProfile && (
            <EditProfile
              profileUser={profileUser}
              formData={formData}
              setFormData={setFormData}
              setIsEditing={setIsEditing}
              API_BASE_URL={API_BASE_URL}
              handleEditProfile={handleEditProfile}
            />
          )}

          {/* Search Modal (Own Profile Only) */}
          {isOwnProfile && (
            <div className="fixed bottom-4 right-4">
              <div className="relative">
                <button
                  onClick={() => setSearchQuery(searchQuery ? "" : " ")}
                  className="p-3 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {searchQuery && (
                  <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-xl p-4">
                    <input
                      type="text"
                      value={searchQuery.trim()}
                      onChange={handleSearch}
                      placeholder="Search users..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {searchResults.length > 0 && (
                      <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  result.picture ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={result.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {result.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {result.email}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/profile/${result.id}`)}
                              className="px-3 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
