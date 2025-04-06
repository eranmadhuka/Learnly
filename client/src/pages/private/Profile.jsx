import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Please login to view this page
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-indigo-600 p-6 text-white">
              <div className="flex flex-col md:flex-row items-center">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                )}
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {user.name}
                  </h1>
                  <p className="text-indigo-100">{user.email}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-indigo-500 text-xs px-2 py-1 rounded-full">
                      {user.provider
                        ? user.provider.charAt(0).toUpperCase() +
                          user.provider.slice(1)
                        : "Social App"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h2>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="text-gray-800 font-mono text-sm">{user.id}</p>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Account Information
                </h2>
                <div>
                  <p className="text-sm text-gray-500">Sign-in Method</p>
                  <p className="text-gray-800 font-medium">
                    {user.provider
                      ? `${
                          user.provider.charAt(0).toUpperCase() +
                          user.provider.slice(1)
                        } OAuth`
                      : "Email/Password"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-800 font-medium">
                    {new Date().toLocaleDateString()}{" "}
                    {/* Replace with actual join date if available */}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="text-green-600 font-medium">Active</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
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
            </div>
          </div>

          {/* Additional Sections (example) */}
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Activity Summary
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Posts</p>
                <p className="text-2xl font-bold text-indigo-600">0</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Followers</p>
                <p className="text-2xl font-bold text-indigo-600">0</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Following</p>
                <p className="text-2xl font-bold text-indigo-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
