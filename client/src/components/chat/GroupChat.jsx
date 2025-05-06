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
      toast.success("Message sent!", { position: "top-right" });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Group List */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-indigo-600">Communities</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            New Group
          </button>
        </div>
        <GroupList userId={userId} setSelectedGroup={setSelectedGroup} />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            <div className="p-4 bg-indigo-600 text-white">
              <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg._id || `${msg.timestamp}-${msg.senderId}`}
                  message={msg}
                  userId={userId}
                />
              ))}
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a community to start chatting
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
