import React, { useState, useEffect } from "react";
import axios from "axios"; // Use global Axios if configured separately
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProfileCard from "../../components/profile/ProfileCard";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const Peoples = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnfollowedUsers = async () => {
      try {
        if (!user) {
          throw new Error("Please log in to view people");
        }

        // Fetch current user's details to get their ID
        const userResponse = await axios.get(`${API_BASE_URL}/api/users/me`, {
          withCredentials: true,
        });
        const userId = userResponse.data.id;
        // console.log("User Response:", userResponse.data);

        // Fetch users the current user is following
        const followingResponse = await axios.get(
          `${API_BASE_URL}/api/users/${userId}/following`,
          {
            withCredentials: true,
          }
        );
        const followingIds = Array.isArray(followingResponse.data)
          ? followingResponse.data.map((u) => u.id)
          : [];
        // console.log("Following IDs:", followingIds);

        // Fetch all users
        const usersResponse = await axios.get(`${API_BASE_URL}/api/users`, {
          withCredentials: true,
        });

        // Filter out followed users
        const fetchedUsers = Array.isArray(usersResponse.data)
          ? usersResponse.data.filter((u) => !followingIds.includes(u.id))
          : [];
        // console.log("Filtered Users:", fetchedUsers);
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch users");
        setUsers([]);
        setLoading(false);
      }
    };

    fetchUnfollowedUsers();
  }, [user]);

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/follow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Follow Response:", response.data);

      // Remove the followed user from the list
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Follow Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(
        err.response?.data?.message ||
          `Failed to follow user (Status: ${err.response?.status || "Unknown"})`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-amber-600 mb-6">
            People You May Know
          </h1>
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
          {!loading && !error && users.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No users to follow.
            </div>
          )}
          {!loading && !error && users.length > 0 && (
            <div className="space-y-3">
              {users.map((user) => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  actionType="follow"
                  onFollow={handleFollow}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Peoples;
