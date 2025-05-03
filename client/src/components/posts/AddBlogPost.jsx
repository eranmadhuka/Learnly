import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import MediaUpload from "./MediaUpload";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddBlogPost = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return Swal.fire("Missing Fields", "Please fill in all required fields.", "error");
    }

    const imageFiles = mediaFiles.filter((file) => file.type.startsWith("image/"));
    const videoFiles = mediaFiles.filter((file) => file.type.startsWith("video/"));

    if (imageFiles.length > 3) {
      return Swal.fire("Too Many Images", "You can upload up to 3 images.", "error");
    }

    if (videoFiles.length > 1) {
      return Swal.fire("Too Many Videos", "You can upload only 1 video.", "error");
    }

    for (const file of videoFiles) {
      if (file.size > 30 * 1024 * 1024) {
        return Swal.fire("Video Too Large", "Video must be less than 30MB.", "error");
      }
    }

    setLoading(true);

    try {
      const mediaUrls = [];
      const fileTypes = [];

      for (const file of mediaFiles) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        mediaUrls.push(url);
        fileTypes.push(file.type.startsWith("image/") ? "image" : "video");
      }

      const thumbnailUrl = mediaUrls.find((_, index) => fileTypes[index] === "image") || "";

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          title,
          content,
          mediaUrls,
          fileTypes,
          thumbnailUrl,
        },
        { withCredentials: true }
      );

      setTitle("");
      setContent("");
      setMediaFiles([]);
      Swal.fire("Success", "Blog post created successfully!", "success").then(() => {
        navigate(`/profile/${user.id}`);
      });
    } catch (error) {
      console.error("Post creation failed:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Create a New Blog Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
            <MediaUpload onFilesSelected={setMediaFiles} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBlogPost;
