import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import MediaUpload from "./MediaUpload";
import DashboardLayout from "../layout/DashboardLayout";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

const EditPost = () => {
  const { user } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [existingMediaUrls, setExistingMediaUrls] = useState([]);
  const [existingFileTypes, setExistingFileTypes] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch post details when component mounts
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts/${postId}`, {
          withCredentials: true,
        });

        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setTags(post.tags || []);
        setExistingMediaUrls(post.mediaUrls || []);
        setExistingFileTypes(post.fileTypes || []);
      } catch (error) {
        console.error("Failed to fetch post details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load post details. Please try again.",
          confirmButtonColor: "#4f46e5",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (!user) return <Navigate to="/login" replace />;

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (tagInput.trim() && tags.length < 5) {
        const newTag = tagInput.trim().toLowerCase();
        if (!tags.includes(newTag)) setTags([...tags, newTag]);
        setTagInput("");
      } else if (tags.length >= 5) {
        Swal.fire({
          icon: "warning",
          title: "Limit Reached",
          text: "You can add up to 5 tags.",
          confirmButtonColor: "#4f46e5",
        });
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleRemoveExistingMedia = (urlToRemove) => {
    const index = existingMediaUrls.indexOf(urlToRemove);
    if (index !== -1) {
      setExistingMediaUrls(
        existingMediaUrls.filter((url) => url !== urlToRemove)
      );
      setExistingFileTypes(existingFileTypes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Title and content are required.",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    setUploading(true);
    try {
      const newMediaUrls = [];
      const newFileTypes = [];

      // Upload new media files
      for (const file of mediaFiles) {
        const storageRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              newMediaUrls.push(url);
              newFileTypes.push(
                file.type.startsWith("image/") ? "image" : "video"
              );
              resolve();
            }
          );
        });
      }

      // Combine existing and new media
      const mediaUrls = [...existingMediaUrls, ...newMediaUrls];
      const fileTypes = [...existingFileTypes, ...newFileTypes];

      // Validate media counts
      const imageCount = fileTypes.filter((type) => type === "image").length;
      const videoCount = fileTypes.filter((type) => type === "video").length;

      if (imageCount > 3) {
        Swal.fire({
          icon: "error",
          title: "Too Many Images",
          text: "You can upload up to 3 images.",
          confirmButtonColor: "#4f46e5",
        });
        setUploading(false);
        return;
      }

      if (videoCount > 1) {
        Swal.fire({
          icon: "error",
          title: "Too Many Videos",
          text: "You can upload only 1 video.",
          confirmButtonColor: "#4f46e5",
        });
        setUploading(false);
        return;
      }

      // Determine thumbnail
      const thumbnailUrl =
        mediaUrls.find((_, i) => fileTypes[i] === "image") || "";

      // Update post
      const response = await axios.put(
        `${apiUrl}/api/posts/${postId}`,
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
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Post updated successfully!",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          navigate(`/profile/${user.id}`);
        });
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update post.",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard changes?")) {
      navigate(`/profile/${user.id}`);
    }
  };

  const renderExistingMediaPreviews = () => {
    return existingMediaUrls.map((url, index) => (
      <div key={url} className="relative">
        {existingFileTypes[index] === "image" ? (
          <img
            src={url}
            alt={`Existing media ${index + 1}`}
            className="w-24 h-24 object-cover rounded-md"
          />
        ) : (
          <video
            src={url}
            controls
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
        <button
          type="button"
          onClick={() => handleRemoveExistingMedia(url)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
          disabled={uploading}
        >
          ×
        </button>
        {index === 0 && existingFileTypes[index] === "image" && (
          <span className="absolute bottom-1 left-1 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
            Thumbnail
          </span>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <p>Loading post details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Post</h2>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Media
            </label>
            <div className="flex space-x-2 mb-4 flex-wrap gap-2">
              {renderExistingMediaPreviews()}
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
              {uploading ? "Updating..." : "Update Post"}
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

export default EditPost;
