import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProfileCard from "../../components/profile/ProfileCard";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!user) {
          throw new Error("Please log in to view friends");
        }

        // Fetch current user's details to get their ID
        const userResponse = await axios.get(`${API_BASE_URL}/api/users/me`, {
          withCredentials: true,
        });

        const userId = userResponse.data.id;

        // Fetch the list of users the current user is following
        const friendsResponse = await axios.get(
          `${API_BASE_URL}/api/users/${userId}/following`,
          {
            withCredentials: true,
          }
        );

        // Ensure response is an array
        const fetchedFriends = Array.isArray(friendsResponse.data)
          ? friendsResponse.data
          : [];
        setFriends(fetchedFriends);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to fetch friends");
        setFriends([]);
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  const handleUnfollow = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/unfollow/${userId}`, {
        withCredentials: true,
      });

      // Remove the unfollowed user from the list
      setFriends(friends.filter((friend) => friend.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unfollow user");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-amber-600 mb-6">My Friends</h1>
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {!loading && !error && friends.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              You are not following anyone yet.
            </div>
          )}
          {!loading && !error && friends.length > 0 && (
            <div className="space-y-3">
              {friends.map((friend) => (
                <ProfileCard
                  key={friend.id}
                  user={friend}
                  actionType="unfollow"
                  onUnfollow={handleUnfollow}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Friends;
