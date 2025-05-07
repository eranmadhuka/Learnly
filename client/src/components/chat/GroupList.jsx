import { useState, useEffect } from "react";
import { getUserGroups } from "../../services/api";

const GroupList = ({ userId, setSelectedGroup, selectedGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await getUserGroups(userId);
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-amber-600 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p className="text-center">
          No communities found. Create your first community using the + button.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => setSelectedGroup(group)}
          className={`p-4 cursor-pointer hover:bg-amber-50 border-b border-amber-100 transition-colors ${
            selectedGroup?._id === group._id ? "bg-amber-100" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mr-3">
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{group.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {group.description || "No description"}
              </p>
            </div>
            {group.unreadCount > 0 && (
              <span className="bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {group.unreadCount}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
