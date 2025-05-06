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
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    picture: "",
    isPrivate: false,
    file: null,
  });
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
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
      <div className="bg-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <div className="p-6 text-black">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <img
                  src={profileUser.picture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-2 border-white"
                />
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                    {profileUser.isPrivate && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-200"
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
                  <p className="text-blue-900">{profileUser.email}</p>
                  {profileUser.bio && (
                    <p className="mt-2 text-blue-900">{profileUser.bio}</p>
                  )}
                </div>
                {!isOwnProfile && currentUser && (
                  <div>
                    {isFollowing ? (
                      <button
                        onClick={handleUnfollow}
                        className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className="px-4 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center space-x-6 px-4 py-3 bg-gray-50">
              <div className="text-center">
                <span className="block text-xl font-bold text-amber-700">
                  {posts.length}
                </span>
                <span className="text-gray-600">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-amber-700">
                  {followers.length}
                </span>
                <span className="text-gray-600">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-amber-700">
                  {following.length}
                </span>
                <span className="text-gray-600">Following</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "posts"
                    ? "text-amber-700 border-b-2 border-amber-700"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "followers"
                    ? "text-amber-700 border-b-2 border-amber-700"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() => setActiveTab("followers")}
              >
                Followers
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
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
                  className={`flex-1 py-3 text-center font-medium ${
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
            <div className="p-4">
              {/* Posts Tab */}
              {activeTab === "posts" && (
                <div>
                  {isOwnProfile && (
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Your Posts
                      </h2>
                      <button
                        onClick={handleAddPost}
                        className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                  )}
                  {!isOwnProfile && (
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {profileUser.name}'s Posts
                    </h2>
                  )}
                  {profileUser.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600 mt-2">
                        This account is private. Follow to see their posts.
                      </p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No posts yet.</p>
                      {isOwnProfile && (
                        <button
                          onClick={handleAddPost}
                          className="mt-2 px-4 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                        >
                          Create Your First Post
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 bg-gray-50 rounded border border-gray-200"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mt-2 line-clamp-3">
                            {post.content}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          {isOwnProfile && (
                            <div className="flex justify-end space-x-2 mt-2">
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Followers
                  </h2>
                  {profileUser.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600 mt-2">
                        This account is private. Follow to see their followers.
                      </p>
                    </div>
                  ) : followers.length === 0 ? (
                    <p className="text-center py-8 text-gray-600">
                      No followers yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {followers.map((follower) => (
                        <div
                          key={follower.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                follower.picture ||
                                "https://via.placeholder.com/40"
                              }
                              alt={follower.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {follower.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {follower.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/profile/${follower.id}`)}
                            className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Following Tab */}
              {activeTab === "following" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Following
                  </h2>
                  {profileUser.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-600 mt-2">
                        This account is private. Follow to see who they follow.
                      </p>
                    </div>
                  ) : following.length === 0 ? (
                    <p className="text-center py-8 text-gray-600">
                      Not following anyone yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {following.map((followed) => (
                        <div
                          key={followed.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                followed.picture ||
                                "https://via.placeholder.com/40"
                              }
                              alt={followed.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {followed.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {followed.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/profile/${followed.id}`)}
                            className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Profile Settings
                  </h2>

                  {/* Edit Profile Form */}
                  <div className="mb-6">
                    <div className="p-4 rounded border border-gray-200">
                      <EditProfile
                        profileUser={profileUser}
                        formData={formData}
                        setFormData={setFormData}
                        API_BASE_URL={API_BASE_URL}
                        handleEditProfile={handleEditProfile}
                      />
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Account Actions
                    </h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={logout}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                      >
                        Sign Out
                      </button>
                      <button
                        onClick={handleDeleteProfile}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
