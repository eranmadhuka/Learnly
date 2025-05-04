import { useState } from "react";
import { createGroup } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";

const CreateGroupModal = ({ isOpen, onClose, userId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (name.trim()) {
      try {
        await createGroup({
          name,
          description,
          createdBy: userId,
          members: [userId],
        });
        toast.success("Group created!", { position: "top-right" });
        setName("");
        setDescription("");
        onClose();
      } catch (error) {
        toast.error("Failed to create group", { position: "top-right" });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold text-indigo-600 mb-4">
          Create New Group
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateGroupModal;
