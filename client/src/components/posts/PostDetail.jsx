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
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import UserImg from "../../assets/images/user.png";
import Swal from "sweetalert2";
import DashboardLayout from "../layout/DashboardLayout";
import PostActions from "./PostActions";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

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

  const isOwnPost = user && post?.user?.id === user.id;

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        // Fetch post details
        const postResponse = await axios.get(`${apiUrl}/posts/${id}`, {
          withCredentials: true,
        });
        setPost(postResponse.data);
      } catch (error) {
        setLoadError("Failed to load post details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
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
        await axios.delete(`${apiUrl}/posts/${id}`, {
          withCredentials: true,
        });
        Swal.fire({
          title: "Deleted",
          text: "Your post has been removed",
          icon: "success",
          confirmButtonColor: "#4f46e5",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
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
    const result = await Swal.fire({
      title: `Unfollow ${post?.user?.name || "user"}?`,
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
          `${apiUrl}/users/${user.id}/unfollow/${post.user.id}`,
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
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-500" />
            <p className="text-gray-600">{loadError || "Post not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Feed
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${post.user?.id}`}>
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
                    className="font-semibold text-gray-900 hover:text-indigo-600"
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
                            to={`/posts/${post.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
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
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
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
              {post.title}
            </h1>
            <p className="text-gray-600 mb-4">{post.content}</p>

            {post.mediaUrls?.length > 0 && (
              <div className="mb-4">
                <img
                  src={post.mediaUrls[0]}
                  alt="Post media"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.classList.add("p-8");
                    e.target.src = UserImg;
                  }}
                />
              </div>
            )}

            <PostActions postId={id} user={user} />
          </div>

          {/* Commented out comments section */}
          {/* {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 mb-4 last:mb-0">
                <Link to={`/profile/${comment.user?.id}`}>
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    <img
                      src={comment.user?.picture || UserImg}
                      alt={comment.user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Link
                      to={`/profile/${comment.user?.id}`}
                      className="font-semibold text-gray-900 hover:text-indigo-600"
                    >
                      {comment.user?.name || "Unknown User"}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">
                      {comment.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )} */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostDetail;
