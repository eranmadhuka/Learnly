import React, { createContext, useContext, useState } from "react";
import axios from "axios"; // For API calls

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);

  const addBlogPost = async (newPost) => {
    try {
      const response = await axios.post("/api/posts", newPost); // <-- Adjust your API endpoint
      setBlogs((prev) => [...prev, response.data]);
      console.log("Blog Post created successfully!");
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error; // So that AddBlogPost.jsx can catch it
    }
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlogPost }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
