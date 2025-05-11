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
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  if (!user) return <Navigate to="/login" replace />;

  const validateForm = () => {
    const newErrors = {};

    if (title.trim().length < 5 || title.trim().length > 100) {
      newErrors.title = "Title must be between 5 and 100 characters.";
    }

    if (content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters long.";
    }

    if (tags.length > 5) {
      newErrors.tags = "You can add up to 5 tags only.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();

      if (!/^[a-zA-Z0-9-]{2,20}$/.test(newTag)) {
        alert("Tag must be 2–20 characters using letters, numbers, or dashes.");
        return;
      }

      if (tags.includes(newTag)) {
        alert("Tag already added.");
        return;
      }

      if (tags.length >= 5) {
        alert("Maximum of 5 tags allowed.");
        return;
      }

      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      const mediaUrls = [];
      const fileTypes = [];

      for (const file of mediaFiles) {
        const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              mediaUrls.push(url);
              fileTypes.push(file.type.startsWith("image/") ? "image" : "video");
              resolve();
            }
          );
        });
      }

      const thumbnailUrl = mediaUrls.find((_, i) => fileTypes[i] === "image") || "";

      await axios.post(
        `${apiUrl}/api/posts`,
        {
          title: title.trim(),
          content: content.trim(),
          tags,
          mediaUrls,
          fileTypes,
          thumbnailUrl,
          user: { id: user.id },
        },
        { withCredentials: true }
      );

      alert("Post created successfully!");
      setTitle("");
      setContent("");
      setTags([]);
      setMediaFiles([]);
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Post creation failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Post title"
              disabled={uploading}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={6}
              placeholder="Write your post..."
              disabled={uploading}
            />
            {errors.content && (
              <p className="text-red-600 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-gray-700">Tags</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 p-2 border rounded-md"
                placeholder="Enter tag and press Enter"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-amber-500 text-white rounded"
                disabled={uploading}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-amber-600 hover:text-amber-800"
                    disabled={uploading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.tags && (
              <p className="text-red-600 text-sm mt-1">{errors.tags}</p>
            )}
          </div>

          {/* Media Upload */}
          <MediaUpload
            onFilesSelected={setMediaFiles}
            mediaFiles={mediaFiles}
          />

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className={`flex-1 bg-amber-600 text-white py-2 rounded hover:bg-amber-700 ${
                uploading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/profile/${user.id}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
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
