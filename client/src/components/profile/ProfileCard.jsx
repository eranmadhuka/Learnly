import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ user, actionType, onFollow, onUnfollow }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <img
          src={user.picture || "https://via.placeholder.com/40"}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/profile/${user.id}`)}
          className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
        >
          View
        </button>
        {actionType === "follow" && (
          <button
            onClick={() => onFollow(user.id)}
            className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
          >
            Follow
          </button>
        )}
        {actionType === "unfollow" && (
          <button
            onClick={() => onUnfollow(user.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Unfollow
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
