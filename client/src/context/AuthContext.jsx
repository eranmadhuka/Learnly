import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        withCredentials: true, // Ensure cookies/session is sent
      });
      setUser(response.data); // Expecting User object from /api/users/me
    } catch (err) {
      console.error("Auth check failed:", err.response?.data || err.message);
      setUser(null); // Clear user on failure (e.g., 401 Unauthorized or 404 Not Found)
    } finally {
      setLoading(false);
    }
  };

  const login = (provider) => {
    // Redirect to OAuth2 authorization endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login"; // Redirect to login page after logout
      return true;
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); // Run on mount to verify authentication status
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
