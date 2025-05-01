import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [newComment, setNewComment] = useState({}); // postId -> new comment text
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentProviderId, setCurrentProviderId] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users/me", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.id); // Mongo _id for post owner match
      setCurrentProviderId(res.data.providerId); // For comment owner match
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

  //like unlike post
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

  const handleAddReply = async (postId, parentCommentId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/comments`,
        {
          postId,
          content: replyContent,
          parentCommentId, // 👈 optional, for nested replies
        },
        { withCredentials: true }
      );
      setReplyingToCommentId(null);
      setReplyContent("");
      fetchPosts(); // refresh the list
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
                  {(() => {
                    const parentComments = post.comments.filter(
                      (c) => !c.parentCommentId
                    );
                    const replies = post.comments.filter(
                      (c) => c.parentCommentId
                    );
                    return parentComments.map((comment) => {
                      const isCommentOwner =
                        comment.userId === currentProviderId;
                      const isPostOwner = post.user.id === currentUserId;
                      const childReplies = replies.filter(
                        (r) => r.parentCommentId === comment.id
                      );

                      return (
                        <div
                          key={comment.id}
                          className="mb-3 p-3 rounded-lg bg-gray-100"
                        >
                          {editingCommentId === comment.id ? (
                            <>
                              <textarea
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                                className="w-full p-2 rounded-md border focus:outline-none focus:ring"
                              />
                              <div className="flex gap-2 mt-2 justify-end">
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
                              <div className="flex gap-3 items-start">
                                {comment.userPicture && (
                                  <img
                                    src={comment.userPicture}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {comment.userDisplayName || "User"}
                                  </p>
                                  <p className="text-gray-900">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 mt-2">
                                <button
                                  onClick={() => {
                                    setReplyingToCommentId(comment.id);
                                    setReplyContent("");
                                  }}
                                  className="text-green-600 text-xs hover:underline"
                                >
                                  Reply
                                </button>
                                {isCommentOwner && (
                                  <button
                                    onClick={() => startEditing(comment)}
                                    className="text-blue-600 text-xs hover:underline"
                                  >
                                    Edit
                                  </button>
                                )}
                                {(isCommentOwner || isPostOwner) && (
                                  <button
                                    onClick={() => deleteComment(comment.id)}
                                    className="text-red-600 text-xs hover:underline"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>

                              {replyingToCommentId === comment.id && (
                                <div className="mt-2">
                                  <textarea
                                    value={replyContent}
                                    onChange={(e) =>
                                      setReplyContent(e.target.value)
                                    }
                                    placeholder="Write a reply..."
                                    className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      onClick={() =>
                                        handleAddReply(post.id, comment.id)
                                      }
                                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                      Post Reply
                                    </button>
                                    <button
                                      onClick={() => {
                                        setReplyingToCommentId(null);
                                        setReplyContent("");
                                      }}
                                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Render replies */}
                              {childReplies.length > 0 && (
                                <div className="mt-3 ml-6 space-y-2">
                                  {childReplies.map((reply) => {
                                    const isReplyOwner =
                                      reply.userId === currentProviderId;
                                    return (
                                      <div
                                        key={reply.id}
                                        className="bg-gray-50 p-2 rounded-md text-sm border"
                                      >
                                        <div className="flex gap-3 items-start">
                                          {reply.userPicture && (
                                            <img
                                              src={reply.userPicture}
                                              alt="avatar"
                                              className="w-7 h-7 rounded-full object-cover"
                                            />
                                          )}
                                          <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                              {reply.userDisplayName || "User"}
                                            </p>
                                            <p className="text-gray-800">
                                              {reply.content}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-1">
                                          <button
                                            onClick={() => {
                                              setReplyingToCommentId(reply.id);
                                              setReplyContent("");
                                            }}
                                            className="text-green-600 text-xs hover:underline"
                                          >
                                            Reply
                                          </button>
                                          {isReplyOwner && (
                                            <button
                                              onClick={() =>
                                                startEditing(reply)
                                              }
                                              className="text-blue-600 text-xs hover:underline"
                                            >
                                              Edit
                                            </button>
                                          )}
                                          {(isReplyOwner || isPostOwner) && (
                                            <button
                                              onClick={() =>
                                                deleteComment(reply.id)
                                              }
                                              className="text-red-600 text-xs hover:underline"
                                            >
                                              Delete
                                            </button>
                                          )}
                                        </div>

                                        {replyingToCommentId === reply.id && (
                                          <div className="mt-2">
                                            <textarea
                                              value={replyContent}
                                              onChange={(e) =>
                                                setReplyContent(e.target.value)
                                              }
                                              placeholder="Write a reply..."
                                              className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring"
                                              rows={2}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                              <button
                                                onClick={() =>
                                                  handleAddReply(
                                                    post.id,
                                                    reply.id
                                                  )
                                                }
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                              >
                                                Post Reply
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setReplyingToCommentId(null);
                                                  setReplyContent("");
                                                }}
                                                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    });
                  })()}
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
