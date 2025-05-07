import { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp, MessageCircle, Bookmark, Share2, Send } from "lucide-react";
import Swal from "sweetalert2";

const PostActions = ({ postId, user }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

  useEffect(() => {
    const fetchActionData = async () => {
      try {
        // Note: Like count and has-liked endpoints are not in provided backend
        // Assuming they exist or need to be implemented
        const likesResponse = await axios.get(
          `${apiUrl}/posts/${postId}/like-count`,
          { withCredentials: true }
        );
        setLikes(likesResponse.data || 0);

        if (user) {
          const userLikeResponse = await axios.get(
            `${apiUrl}/posts/${postId}/has-liked`,
            { withCredentials: true }
          );
          setHasLiked(userLikeResponse.data);

          const savedResponse = await axios.get(
            `${apiUrl}/users/${user.id}/saved`,
            { withCredentials: true }
          );
          setIsSaved(savedResponse.data.includes(postId));

          // Note: Comments endpoint is not in provided backend
          const commentsResponse = await axios.get(
            `${apiUrl}/comments/${postId}/all`,
            { withCredentials: true }
          );
          setComments(commentsResponse.data || []);
          setCommentCount(commentsResponse.data.length || 0);
        }
      } catch (error) {
        console.error("Error fetching action data:", error);
      }
    };

    fetchActionData();
  }, [postId, user]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Sign in required",
        text: "You must be logged in to like posts",
        icon: "info",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);

      await axios.post(
        `${apiUrl}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes + 1 : likes - 1);
      Swal.fire({
        title: "Error",
        text: "Failed to update like status",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        timer: 1500,
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Sign in required",
        text: "You must be logged in to comment",
        icon: "info",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/comments`,
        {
          postId,
          content: newComment,
        },
        { withCredentials: true }
      );

      setComments((prev) => [...prev, response.data]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to post comment",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        timer: 1500,
      });
    }
  };

  const toggleSavePost = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Sign in required",
        text: "You must be logged in to save posts",
        icon: "info",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setIsSaved(!isSaved);
      if (isSaved) {
        await axios.post(
          `${apiUrl}/users/${user.id}/unsave/${postId}`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${apiUrl}/users/${user.id}/save/${postId}`,
          {},
          { withCredentials: true }
        );
      }
    } catch (error) {
      setIsSaved(!isSaved);
      Swal.fire({
        title: "Error",
        text: "Failed to save/unsave post",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        timer: 1500,
      });
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    const postUrl = `${window.location.origin}/posts/${postId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Post",
          text: "Check out this post!",
          url: postUrl,
        })
        .catch(() => {
          copyToClipboard(postUrl);
        });
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        Swal.fire({
          title: "Link copied!",
          text: "Post link copied to clipboard",
          icon: "success",
          confirmButtonColor: "#4f46e5",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          title: "Copy failed",
          text: "Could not copy link to clipboard",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      });
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      <div className="flex items-center space-x-6 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            hasLiked ? "text-indigo-600" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ThumbsUp size={18} className={hasLiked ? "fill-indigo-600" : ""} />
          <span className="text-sm font-medium">
            {likes > 0 ? likes : "Like"}
          </span>
        </button>
        <div className="flex items-center space-x-2 text-gray-600">
          <MessageCircle size={18} />
          <span className="text-sm font-medium">
            {commentCount > 0 ? commentCount : "Comment"}
          </span>
        </div>
        <button
          onClick={toggleSavePost}
          className={`flex items-center p-1 rounded-full ${
            isSaved
              ? "text-indigo-600 bg-indigo-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Bookmark size={18} className={isSaved ? "fill-indigo-600" : ""} />
        </button>
        <button
          onClick={handleShare}
          className="flex items-center p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <Share2 size={18} />
        </button>
      </div>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
            <img
              src={user?.picture || "/path/to/default-user.png"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="p-2 text-indigo-600 hover:text-indigo-800"
            disabled={!newComment.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostActions;
