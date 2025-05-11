import { useState, useEffect } from "react";
import GroupList from "./GroupList";
import MessageBubble from "./MessageBubble";
import CreateGroupModal from "./CreateGroupModal";
import useGroupChat from "../../hooks/useGroupChat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GroupChat = ({ userId }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { messages, sendMessage, connectionStatus } = useGroupChat(
    userId,
    selectedGroup?.isMember ? selectedGroup.id : null
  );

  useEffect(() => {
    console.debug("Selected group:", selectedGroup);
  }, [selectedGroup]);

  const handleSend = () => {
    if (!content.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    if (!selectedGroup || !selectedGroup.id) {
      console.error("No group selected or group ID missing:", selectedGroup);
      toast.error("Please select a group before sending a message.");
      return;
    }
    if (!selectedGroup.isMember) {
      toast.error("You must be a member to send messages in this group.");
      return;
    }
    const message = {
      groupId: selectedGroup.id,
      content,
    };
    console.debug("Sending message:", message);
    sendMessage(message);
    setContent("");
    if (connectionStatus === "connected") {
      toast.success("Message sent!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Group List */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-gray-600"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <path d="M6 8h.01"></path>
              <path d="M10 8h.01"></path>
              <path d="M14 8h.01"></path>
              <path d="M18 8h.01"></path>
              <path d="M8 12h.01"></path>
              <path d="M12 12h.01"></path>
              <path d="M16 12h.01"></path>
              <path d="M6 16h.01"></path>
              <path d="M10 16h.01"></path>
              <path d="M14 16h.01"></path>
              <path d="M18 16h.01"></path>
            </svg>
            Communities
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center"
            title="Create New Group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <GroupList
          userId={userId}
          setSelectedGroup={setSelectedGroup}
          selectedGroup={selectedGroup}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700">
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedGroup.members?.length || 0} members
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Status: {connectionStatus}
                {selectedGroup.isMember ? "" : " (Not a member)"}
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} userId={userId} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-4"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p className="text-lg">No messages yet</p>
                  <p className="text-sm">Be the first to send a message!</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                  disabled={!selectedGroup.isMember}
                />
                <button
                  onClick={handleSend}
                  disabled={
                    !content.trim() ||
                    !selectedGroup?.id ||
                    !selectedGroup.isMember
                  }
                  className={`p-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center ${
                    !content.trim() ||
                    !selectedGroup?.id ||
                    !selectedGroup.isMember
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-gray-400"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p className="text-xl font-medium mb-2">
              Select a community to start chatting
            </p>
            <p className="text-gray-500">
              Or create a new one with the + button
            </p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
      <ToastContainer />
    </div>
  );
};

export default GroupChat;
