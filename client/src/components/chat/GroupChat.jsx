import { useState } from "react";
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
  const { messages, sendMessage } = useGroupChat(userId, selectedGroup?._id);

  const handleSend = () => {
    if (content.trim() && selectedGroup) {
      const message = {
        groupId: selectedGroup._id,
        senderId: userId,
        content,
        timestamp: new Date().toISOString(),
        status: "sent",
      };
      sendMessage(message);
      setContent("");
      toast.success("Message sent!", {
        position: "top-right",
        style: {
          background: "#FEF3C7",
          color: "#92400E",
          borderLeft: "4px solid #D97706",
        },
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-amber-50 rounded-lg shadow-lg overflow-hidden">
      {/* Group List */}
      <div className="w-1/3 bg-white border-r border-amber-200">
        <div className="p-4 flex justify-between items-center bg-amber-600 text-white">
          <h2 className="text-lg font-semibold flex items-center">
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
              className="mr-2"
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
            className="p-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors flex items-center justify-center"
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
            <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center mr-3">
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-xs text-amber-100">
                    {selectedGroup.members?.length || 0} members
                  </p>
                </div>
              </div>
              <button className="text-white hover:text-amber-200 transition-colors">
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
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <MessageBubble key={msg._id} message={msg} userId={userId} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-amber-600 opacity-60">
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
            <div className="p-4 bg-white border-t border-amber-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-amber-300"
                />
                <button
                  onClick={handleSend}
                  disabled={!content.trim()}
                  className={`p-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center ${
                    !content.trim() ? "opacity-50 cursor-not-allowed" : ""
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
          <div className="flex-1 flex flex-col items-center justify-center text-amber-600">
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
              className="mb-4 text-amber-400"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p className="text-xl font-medium mb-2">
              Select a community to start chatting
            </p>
            <p className="text-amber-500">
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
