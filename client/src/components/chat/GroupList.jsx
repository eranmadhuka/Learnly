import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const GroupList = ({ userId, setSelectedGroup, selectedGroup }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/groups`, {
          params: { userId },
          withCredentials: true,
        });

        console.debug("Fetched groups:", response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error(error.response?.data?.message || "Error fetching groups.");
      }
    };
    fetchGroups();
  }, [userId]);

  return (
    <div className="overflow-y-auto">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => {
            console.debug("Selecting group:", group);
            setSelectedGroup(group);
          }}
          className={`p-4 cursor-pointer hover:bg-gray-100 ${
            selectedGroup?.id === group.id ? "bg-gray-200" : ""
          }`}
        >
          <h3 className="font-semibold">{group.name}</h3>
          <p className="text-sm text-gray-500">{group.description}</p>
          <p className="text-xs text-gray-400">
            {group.isMember ? "Member" : "Not a member"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
