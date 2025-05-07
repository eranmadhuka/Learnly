import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [newComment, setNewComment] = useState({});
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentProviderId, setCurrentProviderId] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users/me", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.id);
      setCurrentProviderId(res.data.providerId);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

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
      console.error("Error fetching posts:", err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8081/api/comments/${commentId}`, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      console.error("Error deleting comment:", err);
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
      console.error("Error saving edited comment:", err);
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
          userId: currentProviderId,
        },
        { withCredentials: true }
      );

      setNewComment({ ...newComment, [postId]: "" });
      fetchPosts();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/likes`,
        {
          postId,
          userId: currentProviderId,
        },
        { withCredentials: true }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: response.data
                  ? [...post.likes, response.data]
                  : post.likes.filter(
                      (like) => like.userId !== currentProviderId
                    ),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddReply = async (postId, parentCommentId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/comments`,
        {
          postId,
          content: replyContent,
          parentCommentId,
          userId: currentProviderId,
        },
        { withCredentials: true }
      );
      setReplyingToCommentId(null);
      setReplyContent("");
      fetchPosts();
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  // Helper function to determine if a comment can be replied to
  const canReply = (comment, allComments) => {
    if (!comment.parentCommentId) {
      // Top-level comment can always be replied to
      return true;
    }
    // Check if the comment's parent is a top-level comment (i.e., first-level reply)
    const parentComment = allComments.find(
      (c) => c.id === comment.parentCommentId
    );
    return parentComment && !parentComment.parentCommentId;
  };

  // Toggle visibility of second-level replies
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold p-4 text-center text-gray-900">
          Feed
        </h1>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 p-4">
            No posts available yet.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg mb-4"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {post.title}
                </h2>
                <p className="text-gray-700 text-sm mt-1">{post.content}</p>
              </div>

              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="grid grid-cols-1">
                  {post.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Media"
                      className="w-full h-96 object-cover"
                    />
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-blue-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between p-4 text-gray-900 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`text-2xl ${
                      post.likes.some(
                        (like) => like.userId === currentProviderId
                      )
                        ? "text-red-500"
                        : "text-gray-900"
                    } hover:text-red-500`}
                  >
                    {post.likes.some(
                      (like) => like.userId === currentProviderId
                    )
                      ? "❤️"
                      : "♡"}
                  </button>
                  <span>{post.likes.length} Likes</span>
                </div>
                <span>{post.comments.length} Comments</span>
              </div>

              {post.comments.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Comments
                  </h3>
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
                        <div key={comment.id} className="mb-3">
                          {editingCommentId === comment.id ? (
                            <>
                              <textarea
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex gap-2 mt-2 justify-end">
                                <button
                                  onClick={() => saveEditedComment(comment.id)}
                                  className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-gray-500 text-sm font-medium hover:underline"
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
                                  <p className="text-sm font-semibold text-gray-900">
                                    {comment.userDisplayName || "User"}
                                  </p>
                                  <p className="text-gray-900 text-sm">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-3 mt-1 text-xs">
                                {canReply(comment, post.comments) && (
                                  <button
                                    onClick={() => {
                                      setReplyingToCommentId(comment.id);
                                      setReplyContent("");
                                    }}
                                    className="text-gray-500 hover:underline"
                                  >
                                    Reply
                                  </button>
                                )}
                                {isCommentOwner && (
                                  <button
                                    onClick={() => startEditing(comment)}
                                    className="text-gray-500 hover:underline"
                                  >
                                    Edit
                                  </button>
                                )}
                                {(isCommentOwner || isPostOwner) && (
                                  <button
                                    onClick={() => deleteComment(comment.id)}
                                    className="text-gray-500 hover:underline"
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
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      onClick={() =>
                                        handleAddReply(post.id, comment.id)
                                      }
                                      className="text-blue-600 text-sm font-medium hover:underline"
                                    >
                                      Post
                                    </button>
                                    <button
                                      onClick={() => {
                                        setReplyingToCommentId(null);
                                        setReplyContent("");
                                      }}
                                      className="text-gray-500 text-sm font-medium hover:underline"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {childReplies.length > 0 && (
                                <div className="mt-3 ml-8 space-y-2">
                                  {childReplies.map((reply) => {
                                    const isReplyOwner =
                                      reply.userId === currentProviderId;
                                    const secondLevelReplies = replies.filter(
                                      (r) => r.parentCommentId === reply.id
                                    );
                                    const isExpanded = expandedReplies.has(
                                      reply.id
                                    );

                                    return (
                                      <div key={reply.id}>
                                        <div className="text-sm">
                                          <div className="flex gap-3 items-start">
                                            {reply.userPicture && (
                                              <img
                                                src={reply.userPicture}
                                                alt="avatar"
                                                className="w-7 h-7 rounded-full object-cover"
                                              />
                                            )}
                                            <div>
                                              <p className="text-sm font-semibold text-gray-900">
                                                {reply.userDisplayName ||
                                                  "User"}
                                              </p>
                                              <p className="text-gray-900 text-sm">
                                                {reply.content}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="flex gap-3 mt-1 text-xs">
                                            {canReply(reply, post.comments) && (
                                              <button
                                                onClick={() => {
                                                  setReplyingToCommentId(
                                                    reply.id
                                                  );
                                                  setReplyContent("");
                                                }}
                                                className="text-gray-500 hover:underline"
                                              >
                                                Reply
                                              </button>
                                            )}
                                            {isReplyOwner && (
                                              <button
                                                onClick={() =>
                                                  startEditing(reply)
                                                }
                                                className="text-gray-500 hover:underline"
                                              >
                                                Edit
                                              </button>
                                            )}
                                            {(isReplyOwner || isPostOwner) && (
                                              <button
                                                onClick={() =>
                                                  deleteComment(reply.id)
                                                }
                                                className="text-gray-500 hover:underline"
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
                                                  setReplyContent(
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="Write a reply..."
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                  className="text-blue-600 text-sm font-medium hover:underline"
                                                >
                                                  Post
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setReplyingToCommentId(
                                                      null
                                                    );
                                                    setReplyContent("");
                                                  }}
                                                  className="text-gray-500 text-sm font-medium hover:underline"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {secondLevelReplies.length > 0 && (
                                          <div className="ml-4 mt-2">
                                            <button
                                              onClick={() =>
                                                toggleReplies(reply.id)
                                              }
                                              className="text-gray-500 text-xs font-medium hover:underline"
                                            >
                                              {isExpanded
                                                ? `Hide ${secondLevelReplies.length} Replies`
                                                : `View ${secondLevelReplies.length} Replies`}
                                            </button>
                                            {isExpanded && (
                                              <div className="mt-2 space-y-2">
                                                {secondLevelReplies.map(
                                                  (secondReply) => {
                                                    const isSecondReplyOwner =
                                                      secondReply.userId ===
                                                      currentProviderId;
                                                    return (
                                                      <div
                                                        key={secondReply.id}
                                                        className="text-sm"
                                                      >
                                                        <div className="flex gap-3 items-start">
                                                          {secondReply.userPicture && (
                                                            <img
                                                              src={
                                                                secondReply.userPicture
                                                              }
                                                              alt="avatar"
                                                              className="w-7 h-7 rounded-full object-cover"
                                                            />
                                                          )}
                                                          <div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                              {secondReply.userDisplayName ||
                                                                "User"}
                                                            </p>
                                                            <p className="text-gray-900 text-sm">
                                                              {
                                                                secondReply.content
                                                              }
                                                            </p>
                                                          </div>
                                                        </div>

                                                        <div className="flex gap-3 mt-1 text-xs">
                                                          {isSecondReplyOwner && (
                                                            <button
                                                              onClick={() =>
                                                                startEditing(
                                                                  secondReply
                                                                )
                                                              }
                                                              className="text-gray-500 hover:underline"
                                                            >
                                                              Edit
                                                            </button>
                                                          )}
                                                          {(isSecondReplyOwner ||
                                                            isPostOwner) && (
                                                            <button
                                                              onClick={() =>
                                                                deleteComment(
                                                                  secondReply.id
                                                                )
                                                              }
                                                              className="text-gray-500 hover:underline"
                                                            >
                                                              Delete
                                                            </button>
                                                          )}
                                                        </div>

                                                        {editingCommentId ===
                                                          secondReply.id && (
                                                          <div className="mt-2">
                                                            <textarea
                                                              value={
                                                                editedContent
                                                              }
                                                              onChange={(e) =>
                                                                setEditedContent(
                                                                  e.target.value
                                                                )
                                                              }
                                                              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <div className="flex gap-2 mt-2 justify-end">
                                                              <button
                                                                onClick={() =>
                                                                  saveEditedComment(
                                                                    secondReply.id
                                                                  )
                                                                }
                                                                className="text-blue-600 text-sm font-medium hover:underline"
                                                              >
                                                                Save
                                                              </button>
                                                              <button
                                                                onClick={
                                                                  cancelEditing
                                                                }
                                                                className="text-gray-500 text-sm font-medium hover:underline"
                                                              >
                                                                Cancel
                                                              </button>
                                                            </div>
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
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

              <div className="p-4 border-t border-gray-200">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment[post.id] || ""}
                  onChange={(e) =>
                    handleNewCommentChange(post.id, e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="1"
                />
                <button
                  onClick={() => addNewComment(post.id)}
                  className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                >
                  Post
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
