import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfile from "../../components/profile/EditProfile";
import ProfileCard from "../../components/profile/ProfileCard";
import PostCard from "../../components/posts/PostCard";

const Profile = () => {
  const { user, logout } = useAuth();
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
    file: null,
  });
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const API_BASE_URL =
<<<<<<< HEAD
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);
=======
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  const isOwnProfile = !userId || (user && userId === user.id);
>>>>>>> main

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
          file: null,
        });

        fetchFollowers(userData.id);
        fetchFollowing(userData.id);
        fetchPosts(userData.id);

        if (!isOwnProfile && user) {
          setIsFollowing(userData.followers.includes(user.id));
        }
      } catch (err) {
        console.error(
          "Fetch Profile Error:",
          err.response?.data || err.message
        );
        if (err.response?.status === 404) navigate("/not-found");
      }
    };

    if (user || userId) fetchProfile();
  }, [user, userId, navigate]);

  const fetchFollowers = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/${id}/followers`,
        { withCredentials: true }
      );
      setFollowers(response.data);
    } catch (err) {
      console.error(
        "Fetch Followers Error:",
        err.response?.data || err.message
      );
      setFollowers([]);
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
      console.error(
        "Fetch Following Error:",
        err.response?.data || err.message
      );
      setFollowing([]);
    }
  };

  const fetchPosts = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts/user/${id}`, {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (err) {
      console.error("Fetch Posts Error:", err.response?.data || err.message);
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
      fetchPosts(userId);
    } catch (err) {
      console.error("Follow Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/unfollow/${userId}`, {
        withCredentials: true,
      });
      setIsFollowing(false);
      fetchFollowers(userId);
      fetchPosts(userId);
    } catch (err) {
      console.error("Unfollow Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    }
  };

  const handleEditProfile = async () => {
    try {
      let pictureUrl = formData.picture;

      // If a new file is selected, upload to Firebase
      if (formData.file) {
        const storageRef = ref(
          storage,
          `profile-pictures/${user.id}_${Date.now()}`
        );
        await uploadBytes(storageRef, formData.file);
        pictureUrl = await getDownloadURL(storageRef);
      }

      // Prepare data to send to the backend (exclude file)
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        picture: pictureUrl,
      };

      // Update user profile in MongoDB
      await axios.put(`${API_BASE_URL}/api/users/me`, updateData, {
        withCredentials: true,
      });

      // Fetch updated user data
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        withCredentials: true,
      });
      setProfileUser(response.data);
      setFormData({
        name: response.data.name,
        bio: response.data.bio,
        picture: response.data.picture,
        file: null,
      });
    } catch (err) {
      console.error("Edit Profile Error:", err.response?.data || err.message);
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
        console.error(
          "Delete Profile Error:",
          err.response?.data || err.message
        );
      }
    }
  };

  const handleAddPost = () => {
    navigate("/add-blog-post");
  };

  if (!user && !userId) {
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
                  <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                  <p className="text-blue-900">{profileUser.email}</p>
                  {profileUser.bio && (
                    <p className="mt-2 text-blue-900">{profileUser.bio}</p>
                  )}
                </div>
                {!isOwnProfile && user && (
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
                        className="px(snip)3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 flex items-center"
                      >
                        New Post
                      </button>
                    </div>
                  )}
                  {!isOwnProfile && (
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {profileUser.name}'s Posts
                    </h2>
                  )}
                  {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                  ) : (
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
                  )}
                </div>
              )}

              {/* Followers Tab */}
              {activeTab === "followers" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Followers
                  </h2>
                  {followers.length === 0 ? (
                    <p className="text-center py-8 text-gray-600">
                      No followers yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {followers.map((follower) => (
                        <ProfileCard key={follower.id} user={follower} />
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
                  {following.length === 0 ? (
                    <p className="text-center py-8 text-gray-600">
                      Not following anyone yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {following.map((followed) => (
                        <ProfileCard key={followed.id} user={followed} />
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
