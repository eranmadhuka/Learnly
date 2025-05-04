import { useState, useEffect } from "react";
import { getUserGroups } from "../../services/api";

const GroupList = ({ userId, setSelectedGroup }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getUserGroups(userId);
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, [userId]);

  return (
    <div>
      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => setSelectedGroup(group)}
          className="p-4 cursor-pointer hover:bg-indigo-50 border-b border-gray-200"
        >
          <h3 className="font-medium text-gray-800">{group.name}</h3>
          <p className="text-sm text-gray-500 truncate">{group.description}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
