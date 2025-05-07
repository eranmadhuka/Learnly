import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  UserMinus,
  Share2,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import UserImg from "../../assets/images/user.png";
import Swal from "sweetalert2";

const PostCard = ({ post, posts, setPosts, savedPosts, setSavedPosts }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post?.likeCount || 0);
  const [hasLiked, setHasLiked] = useState(post?.hasLiked || false);
  const [commentCount, setCommentCount] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);

      return isNaN(date.getTime())
        ? "Unknown date"
        : formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const isSaved = savedPosts?.includes(post.id);
  const isOwnPost = user && post.user?.id === user.id;

  // Close options menu when clicking outside
  useEffect(() => {
    if (isOptionsOpen) {
      const handleClickOutside = (e) => {
        setIsOptionsOpen(false);
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOptionsOpen]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoadingDetails(true);
      setLoadError(null);

      try {
        // Get post like count
        const likesResponse = await axios.get(
          `${apiUrl}/posts/${post.id}/like-count`,
          { withCredentials: true }
        );
        setLikes(likesResponse.data || 0);

        // Check if current user has liked the post
        if (user) {
          const userLikeResponse = await axios.get(
            `${apiUrl}/posts/${post.id}/has-liked`,
            { withCredentials: true }
          );
          setHasLiked(userLikeResponse.data);
        }

        // Get comment count
        const commentsResponse = await axios.get(
          `${apiUrl}/comments/${post.id}/all`,
          { withCredentials: true }
        );
        setCommentCount(
          Array.isArray(commentsResponse.data)
            ? commentsResponse.data.length
            : 0
        );
      } catch (error) {
        setLoadError("Failed to load post details");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchPostDetails();
  }, [post.id, user]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
      // Optimistic update
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);

      await axios.post(
        `${apiUrl}/posts/${post.id}/like`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // Revert on failure
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

  const toggleSavePost = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
      // Optimistic update
      if (isSaved) {
        setSavedPosts((prev) => prev.filter((id) => id !== post.id));
      } else {
        setSavedPosts((prev) => [...prev, post.id]);
      }

      if (isSaved) {
        await axios.post(
          `${apiUrl}/user/${user.id}/unsave/${post.id}`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${apiUrl}/user/${user.id}/save/${post.id}`,
          {},
          { withCredentials: true }
        );
      }

      // Close dropdown after action
      setIsOptionsOpen(false);
    } catch (error) {
      // Revert on failure
      if (isSaved) {
        setSavedPosts((prev) => [...prev, post.id]);
      } else {
        setSavedPosts((prev) => prev.filter((id) => id !== post.id));
      }

      Swal.fire({
        title: "Error",
        text: "Failed to save/unsave post",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        timer: 1500,
      });
    }
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Delete post?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4f46e5",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/posts/${post.id}`, {
          withCredentials: true,
        });

        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));

        Swal.fire({
          title: "Deleted",
          text: "Your post has been removed",
          icon: "success",
          confirmButtonColor: "#4f46e5",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete post",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      }
    }
  };

  const handleUnfollowUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: `Unfollow ${post.user?.name || "user"}?`,
      text: "You will no longer see their posts in your feed",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Unfollow",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `${apiUrl}/user/${user.id}/unfollow/${post.user.id}`,
          {},
          { withCredentials: true }
        );

        Swal.fire({
          title: "Unfollowed",
          text: `You are no longer following ${post.user.name}`,
          icon: "success",
          confirmButtonColor: "#4f46e5",
          timer: 1500,
          showConfirmButton: false,
        });

        // Close dropdown after action
        setIsOptionsOpen(false);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to unfollow user",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      }
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/posts/${post.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: `Check out this post: ${post.title}`,
          url: postUrl,
        })
        .catch((err) => {
          // Fallback if sharing fails
          copyToClipboard(postUrl);
        });
    } else {
      // Fallback for browsers that don't support native sharing
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

  const toggleOptions = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  if (!post || !post.id) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-4 p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="text-red-500" />
          <p className="text-gray-600">Invalid post data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to={`/profile/${post.user?.id}`}
              className="flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                <img
                  src={post.user?.picture || UserImg}
                  alt={post.user?.name || "User"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = UserImg;
                  }}
                />
              </div>
            </Link>
            <div>
              <Link
                to={`/profile/${post.user?.id}`}
                className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {post.user?.name || "Unknown User"}
              </Link>
              <p className="text-xs text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <button
              onClick={toggleOptions}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Post options"
            >
              <MoreHorizontal size={20} />
            </button>
            {isOptionsOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {isOwnPost ? (
                    <>
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        role="menuitem"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit size={16} className="mr-3" /> Edit Post
                      </Link>
                      <button
                        onClick={handleDeletePost}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        role="menuitem"
                      >
                        <Trash2 size={16} className="mr-3" /> Delete Post
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={toggleSavePost}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        role="menuitem"
                      >
                        <Bookmark size={16} className="mr-3" />
                        {isSaved ? "Unsave Post" : "Save Post"}
                      </button>
                      <button
                        onClick={handleUnfollowUser}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        role="menuitem"
                      >
                        <UserMinus size={16} className="mr-3" /> Unfollow User
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    role="menuitem"
                  >
                    <Share2 size={16} className="mr-3" /> Share Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <div className="px-4 pt-2 pb-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">
            {post.content || "No content available"}
          </p>
        </div>

        {post.mediaUrls?.length > 0 && (
          <div className="px-4 pb-4">
            <div className="w-full h-56 md:h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={post.mediaUrls[0]}
                alt="Post media"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.classList.add("p-8");
                  e.target.src = UserImg;
                }}
              />
            </div>
          </div>
        )}
      </Link>

      <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              hasLiked ? "text-indigo-600" : "text-gray-600 hover:text-gray-800"
            } transition-colors`}
          >
            <ThumbsUp size={18} className={hasLiked ? "fill-indigo-600" : ""} />
            <span className="text-sm font-medium">
              {likes > 0 ? likes : "Like"}
            </span>
          </button>

          <Link
            to={`/posts/${post.id}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle size={18} />
            <span className="text-sm font-medium">
              {commentCount > 0 ? commentCount : "Comment"}
            </span>
          </Link>
        </div>

        <button
          onClick={toggleSavePost}
          className={`flex items-center p-1 rounded-full ${
            isSaved
              ? "text-indigo-600 bg-indigo-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          } transition-colors`}
          aria-label={isSaved ? "Unsave post" : "Save post"}
        >
          <Bookmark size={18} className={isSaved ? "fill-indigo-600" : ""} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
