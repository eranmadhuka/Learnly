import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [newComment, setNewComment] = useState({}); // postId -> new comment text

  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users/me", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.id); // or ._id depending on your backend
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/posts/feed", {
        withCredentials: true,
      });
      const postsWithDetails = await Promise.all(
        res.data.map(async (post) => {
          const [commentsRes, likesRes] = await Promise.all([
            axios.get(`http://localhost:8081/api/comments/post/${post.id}`, {
              withCredentials: true,
            }),
            axios.get(`http://localhost:8081/api/likes/post/${post.id}`, {
              withCredentials: true,
            }),
          ]);

          return {
            ...post,
            comments: commentsRes.data,
            likes: likesRes.data,
          };
        })
      );
      setPosts(postsWithDetails);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8081/api/comments/${commentId}`, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const saveEditedComment = async (commentId) => {
    try {
      await axios.put(
        `http://localhost:8081/api/comments/${commentId}`,
        editedContent,
        {
          headers: { "Content-Type": "text/plain" },
          withCredentials: true,
        }
      );
      setEditingCommentId(null);
      setEditedContent("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
  };

  const addNewComment = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/comments`,
        {
          postId,
          content: newComment[postId],
          userId: "", // leave empty, backend can fetch from session (or add if needed)
        },
        { withCredentials: true }
      );

      setNewComment({ ...newComment, [postId]: "" });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/likes`,
        {
          postId,
          userId: "", // backend uses session user
        },
        { withCredentials: true }
      );
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Feed</h1>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-white shadow-lg rounded-2xl p-6 mb-8"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 dark:text-gray-600 mb-4">
                {post.content}
              </p>

              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {post.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Media"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-900 dark:text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    {post.likes.length > 0 ? "Unlike" : "Like"}
                  </button>

                  <span className="ml-2">{post.likes.length} Likes</span>
                </div>
                <div>
                  <span className="font-medium">{post.comments.length}</span>{" "}
                  Comments
                </div>
              </div>

              {post.comments.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Comments:</h3>
                  {post.comments.map((comment) => {
                    const isCommentOwner = comment.userId === currentUserId;
                    const isPostOwner = post.user.id === currentUserId;
                    console.log(
                      "Comment UserId:",
                      comment.userId,
                      "Post OwnerId:",
                      post.user,
                      "Current UserId:",
                      currentUserId
                    );

                    return (
                      <div
                        key={comment.id}
                        className="mb-3 p-3 rounded-lg bg-gray-100 flex flex-col"
                      >
                        {editingCommentId === comment.id ? (
                          <>
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full p-2 rounded-md border focus:outline-none focus:ring"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => saveEditedComment(comment.id)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-900 dark:text-gray-900">
                              {comment.content}
                            </p>
                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => startEditing(comment)}
                                className="text-blue-600 text-xs hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-red-600 text-xs hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Comment Section */}
              <div className="mt-4">
                <textarea
                  placeholder="Write a comment..."
                  value={newComment[post.id] || ""}
                  onChange={(e) =>
                    handleNewCommentChange(post.id, e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring resize-none mb-2"
                  rows="2"
                />
                <button
                  onClick={() => addNewComment(post.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Comment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default Feed;
