import React, { useState } from "react";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import MediaUpload from "./MediaUpload";
import DashboardLayout from "../layout/DashboardLayout";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

const CreatePost = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (tagInput.trim() && tags.length < 5) {
        const newTag = tagInput.trim().toLowerCase();
        if (!tags.includes(newTag)) setTags([...tags, newTag]);
        setTagInput("");
      } else if (tags.length >= 5) {
        alert("You can add up to 5 tags.");
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    setUploading(true);
    try {
      const mediaUrls = [];
      const fileTypes = [];

      for (const [index, file] of mediaFiles.entries()) {
        const storageRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              mediaUrls.push(url);
              fileTypes.push(
                file.type.startsWith("image/") ? "image" : "video"
              );
              resolve();
            }
          );
        });
      }

      const thumbnailUrl =
        mediaUrls.find((_, i) => fileTypes[i] === "image") || "";
      const response = await axios.post(
        `${apiUrl}/api/posts`,
        {
          title,
          content,
          tags,
          mediaUrls,
          fileTypes,
          thumbnailUrl,
          user: { id: user.id },
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Post created successfully!");
        setTitle("");
        setContent("");
        setTags([]);
        setMediaFiles([]);
        navigate(`/profile/${user.id}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create post.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard this post?")) {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter post title"
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="6"
              placeholder="Write your post content..."
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (up to 5)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleAddTag}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Type a tag and press Enter"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-amber-300"
                disabled={uploading}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-amber-600 hover:text-amber-800"
                    disabled={uploading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <MediaUpload
            onFilesSelected={setMediaFiles}
            mediaFiles={mediaFiles}
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className={`flex-1 p-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center justify-center ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={uploading}
            >
              {uploading ? "Creating..." : "Create Post"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreatePost;
