import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Validate post object
  if (!post) {
    console.error("PostCard: Post prop is undefined");
    return null;
  }

  // Check if the current user is the author of the post
  const isAuthor = user && post.user?.id === user.id;

  // Truncate content to 150 characters, with fallback for undefined content
  const truncatedContent =
    post.content &&
    typeof post.content === "string" &&
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content || "";

  // Format date from createdAt timestamp, with fallback
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Recently";

  // Get the first image URL (if available), with fallback
  const imageUrl =
    post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0
      ? post.mediaUrls[0]
      : null;

  // Check if media is video, with fallback
  const isVideo =
    imageUrl &&
    post.fileTypes &&
    Array.isArray(post.fileTypes) &&
    post.fileTypes[0] === "video";

  // Handle click to navigate to post details
  const handlePostClick = () => {
    if (post.id) {
      navigate(`/post/${post.id}`);
    }
  };

  // Handle delete click with confirmation
  const handleDeleteClick = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (confirmDelete && post.id) {
      try {
        console.log("Attempting to delete post ID:", post.id);

        await axios.delete(`${apiUrl}/api/posts/${post.id}`, {
          withCredentials: true,
        });

        alert("Your post has been deleted.");
        navigate(`/feed`);
      } catch (error) {
        console.error("Delete error:", error.message);
        alert(
          error.response?.data?.message ||
            "Failed to delete post. Please try again."
        );
      }
    }
  };

  // Parse tags for display, with fallback
  const displayTags =
    post.tags && Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags.map((tag) => `#${tag}`).join(" ")
      : "";

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200 relative"
      onClick={handlePostClick}
    >
      {/* Header with user info */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img
            src={post.user?.picture || "/api/placeholder/40/40"}
            alt={post.user?.name || "User"}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <div className="flex items-baseline flex-wrap">
              <h3 className="text-base font-semibold text-gray-900">
                {post.user?.name || "Unknown User"}
              </h3>
              <span className="mx-1 text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {post.user?.bio || ""}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Edit and Delete buttons - Only visible for post author */}
          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-post/${post.id}`}
                state={{ post }}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit size={18} />
              </Link>

              <button
                onClick={handleDeleteClick}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100"
                title="Delete post"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Post title and content */}
        <div className="mb-3">
          {post.title && (
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {post.title}
            </h4>
          )}
          {truncatedContent && (
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {truncatedContent}
            </p>
          )}

          {/* Display tags */}
          {displayTags && (
            <p className="text-sm text-blue-600 mt-2">{displayTags}</p>
          )}
        </div>
      </div>

      {/* Media content */}
      {imageUrl && (
        <div className="border-t border-gray-100">
          {isVideo ? (
            <video
              src={imageUrl}
              controls
              className="w-full max-h-96"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={imageUrl}
              alt={post.title || "Post image"}
              className="w-full object-cover max-h-96"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
