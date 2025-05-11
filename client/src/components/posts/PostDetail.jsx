import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  UserMinus,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import DashboardLayout from "../layout/DashboardLayout";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);
      return isNaN(date.getTime())
        ? "Recently"
        : formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  const isOwnPost = user && post?.user?.id === user.id;

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        // Fetch post details
        const postResponse = await axios.get(`${apiUrl}/api/posts/${id}`, {
          withCredentials: true,
        });
        setPost(postResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(
          `${apiUrl}/api/comments/post/${id}`,
          { withCredentials: true }
        );
        setComments(commentsResponse.data);

        // Fetch likes
        const likesResponse = await axios.get(
          `${apiUrl}/api/likes/post/${id}`,
          { withCredentials: true }
        );
        setLikeCount(likesResponse.data.length);
        setLiked(
          user && user.id
            ? likesResponse.data.some((like) => like.user.id === user.id)
            : false
        );
      } catch (error) {
        setLoadError(
          error.response?.data?.message || "Failed to load post details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id, user]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${apiUrl}/api/posts/${id}`, {
          withCredentials: true,
        });
        alert("Post deleted successfully");
        navigate("/feed");
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Failed to delete post. Please try again."
        );
      }
    }
  };

  const handleUnfollowUser = async (e) => {
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to unfollow ${post?.user?.name}?`)
    ) {
      try {
        await axios.delete(`${apiUrl}/api/users/unfollow/${post.user.id}`, {
          withCredentials: true,
        });
        alert(`You have unfollowed ${post.user.name}`);
        setIsOptionsOpen(false);
        navigate("/profile");
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Failed to unfollow user. Please try again."
        );
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please log in to like this post");
      return;
    }
    try {
      if (liked) {
        await axios.delete(`${apiUrl}/api/likes/post/${id}`, {
          withCredentials: true,
        });
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.post(
          `${apiUrl}/api/likes/post/${id}`,
          {},
          { withCredentials: true }
        );
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update like status. Please try again."
      );
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to comment on this post");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment before posting");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/comments/post/${id}`,
        { content: comment },
        { withCredentials: true }
      );
      setComments([...comments, response.data]);
      setComment("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to post comment. Please try again."
      );
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) {
      alert("Please enter a comment before saving");
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/comments/${commentId}`,
        { content: editCommentText },
        { withCredentials: true }
      );
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, content: response.data.content } : c
        )
      );
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update comment. Please try again."
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`${apiUrl}/api/comments/${commentId}`, {
          withCredentials: true,
        });
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Failed to delete comment. Please try again."
        );
      }
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const toggleOptions = (e) => {
    e.preventDefault();
    setIsOptionsOpen(!isOptionsOpen);
  };

  useEffect(() => {
    if (isOptionsOpen) {
      const handleClickOutside = () => setIsOptionsOpen(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOptionsOpen]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="text-red-600" />
            <p className="text-gray-700">{loadError || "Post not found"}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/feed"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Back to Feed
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/feed"
          className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Feed
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${post.user?.id}`}>
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                    <img
                      src={post.user?.picture || "/api/placeholder/40/40"}
                      alt={post.user?.name || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/40/40";
                      }}
                    />
                  </div>
                </Link>
                <div>
                  <Link
                    to={`/profile/${post.user?.id}`}
                    className="font-semibold text-gray-900 hover:text-amber-700"
                  >
                    {post.user?.name || "Unknown User"}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={toggleOptions}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  aria-label="Post options"
                >
                  <MoreHorizontal size={20} />
                </button>
                {isOptionsOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                    <div className="py-1" role="menu">
                      {isOwnPost ? (
                        <>
                          <Link
                            to={`/edit-post/${post.id}`}
                            state={{ post }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700"
                            role="menuitem"
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
                        <button
                          onClick={handleUnfollowUser}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700"
                          role="menuitem"
                        >
                          <UserMinus size={16} className="mr-3" /> Unfollow User
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {post.title || "Untitled"}
            </h1>
            <p className="text-gray-600 whitespace-pre-line mb-4">
              {post.content || ""}
            </p>

            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.mediaUrls &&
            Array.isArray(post.mediaUrls) &&
            post.mediaUrls.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="relative">
                  {post.fileTypes &&
                  Array.isArray(post.fileTypes) &&
                  post.fileTypes[activeMediaIndex] === "video" ? (
                    <video
                      src={post.mediaUrls[activeMediaIndex]}
                      controls
                      className="w-full object-contain max-h-96"
                    />
                  ) : (
                    <img
                      src={post.mediaUrls[activeMediaIndex]}
                      alt={`Media ${activeMediaIndex + 1}`}
                      className="w-full object-contain max-h-96"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/400";
                      }}
                    />
                  )}

                  {post.mediaUrls.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveMediaIndex((prev) =>
                            prev === 0 ? post.mediaUrls.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                        aria-label="Previous media"
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          setActiveMediaIndex((prev) =>
                            prev === post.mediaUrls.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                        aria-label="Next media"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {post.mediaUrls.length > 1 && (
                  <div className="flex overflow-x-auto p-2 gap-2">
                    {post.mediaUrls.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`cursor-pointer flex-shrink-0 ${
                          activeMediaIndex === idx
                            ? "ring-2 ring-amber-500"
                            : ""
                        }`}
                      >
                        {post.fileTypes &&
                        Array.isArray(post.fileTypes) &&
                        post.fileTypes[idx] === "video" ? (
                          <div className="relative w-16 h-16">
                            <video
                              src={url}
                              className="w-16 h-16 object-cover rounded"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-gray-800 bg-opacity-50 rounded-full p-1">
                                <span className="text-white text-xs">▶</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/api/placeholder/64/64";
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          <div className="p-4 border-b border-gray-100 flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">{likeCount} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">
                {comments.length} comments
              </span>
            </div>
          </div>

          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 ${
                liked ? "text-amber-700" : "text-gray-600"
              }`}
              onClick={handleLike}
            >
              <ThumbsUp />
              <span>{liked ? "Unlike" : "Like"}</span>
            </button>
            <button
              className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
              onClick={() => document.getElementById("comment-input")?.focus()}
            >
              <MessageCircle />
              <span>Comment</span>
            </button>
          </div>

          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleComment} className="flex gap-3">
              <img
                src={user?.picture || "/api/placeholder/40/40"}
                alt="Your profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 flex">
                <input
                  id="comment-input"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg ml-2 font-medium disabled:bg-amber-300 hover:bg-amber-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          <div className="divide-y divide-gray-100">
            {comments.length === 0 ? (
              <p className="p-4 text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => {
                const isAuthor = user && comment.user?.id === user.id;
                return (
                  <div key={comment.id} className="p-4">
                    <div className="flex gap-3">
                      <Link to={`/profile/${comment.user?.id}`}>
                        <img
                          src={
                            comment.user?.picture || "/api/placeholder/40/40"
                          }
                          alt={comment.user?.name || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        {editingCommentId === comment.id ? (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <input
                              type="text"
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder="Edit your comment..."
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="bg-amber-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-amber-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg font-medium hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 relative">
                            <Link
                              to={`/profile/${comment.user?.id}`}
                              className="font-semibold text-gray-900 hover:text-amber-700"
                            >
                              {comment.user?.name || "Unknown User"}
                            </Link>
                            <p className="text-gray-700">
                              {comment.content || ""}
                            </p>
                            {isAuthor && (
                              <div className="absolute top-3 right-3 flex space-x-2">
                                <button
                                  onClick={() => startEditingComment(comment)}
                                  className="p-1 text-gray-500 hover:text-amber-700 rounded-full hover:bg-amber-100"
                                  title="Edit comment"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100"
                                  title="Delete comment"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 pl-2">
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostDetail;
