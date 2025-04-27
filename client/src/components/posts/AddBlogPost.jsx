import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useBlog } from "../../context/BlogContext"; // Assuming you have BlogContext

const AddBlogPost = () => {
  const { addBlogPost } = useBlog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    mediaUrls: [],
    fileTypes: [],
    tags: [],
  });

  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = () => {
    if (!currentTag.trim()) return;
    setNewPost((prev) => ({
      ...prev,
      tags: [...prev.tags, currentTag.trim()],
    }));
    setCurrentTag("");
  };

  const removeTag = (index) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim()) {
      setFormError("Please enter a blog title");
      return;
    }
    if (!newPost.content.trim()) {
      setFormError("Please enter blog content");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await addBlogPost(newPost);

      // Reset form after successful submission
      setNewPost({
        title: "",
        content: "",
        mediaUrls: [],
        fileTypes: [],
        tags: [],
      });

      setCurrentTag("");

      // Show success message or redirect
    } catch (error) {
      console.error(error);
      setFormError("Failed to create blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Blog Post</h1>
        </div>

        {formError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Post Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Blog Post Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter blog title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Blog Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  placeholder="Write your blog content..."
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                  rows="6"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter a tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Tag List */}
                {newPost.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {newPost.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors font-medium flex items-center justify-center min-w-32 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBlogPost;
