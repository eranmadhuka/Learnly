import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import CreateGroup from "../../components/group/CreateGroup";
import JoinGroup from "../../components/group/JoinGroup";
import GroupList from "../../components/group/GroupList";
import GroupChat from "../../components/group/GroupChat";

function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/groups`, {
        params: { userId: user.id },
        withCredentials: true,
      });
      setGroups(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load groups");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [...prev, newGroup]);
  };

  const handleGroupJoined = (joinedGroup) => {
    setGroups((prev) => {
      const exists = prev.find((g) => g.id === joinedGroup.id);
      if (exists) return prev;
      return [...prev, joinedGroup];
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CreateGroup onGroupCreated={handleGroupCreated} />
          <JoinGroup onGroupJoined={handleGroupJoined} />
          <GroupList groups={groups} />
        </div>
        <div>
          {groupId ? (
            <GroupChat groupId={groupId} />
          ) : (
            <p className="text-gray-600">Select a group to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Groups;
