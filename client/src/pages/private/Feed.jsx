import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

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

              {/* Media preview if you want */}
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

              {/* Tags */}
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

              {/* Likes and Comments Count */}
              <div className="flex items-center justify-between text-sm text-gray-900 dark:text-gray-500">
                <div>
                  <span className="font-medium">{post.likes.length}</span> Likes
                </div>
                <div>
                  <span className="font-medium">{post.comments.length}</span>{" "}
                  Comments
                </div>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Comments:</h3>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="mb-3">
                      <p className="text-gray-900 dark:text-gray-900">
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default Feed;
