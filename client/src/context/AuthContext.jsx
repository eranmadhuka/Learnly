import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwtToken") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  // Axios interceptor to include JWT token in headers
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      // Clean up interceptor on unmount
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Check authentication status
  const checkAuth = async () => {
    setLoading(true);
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      console.log("Checking authentication with token");
      const response = await axios.get(`${API_BASE_URL}/api/users/me`);
      console.log("Auth response:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Auth check failed:", err.response?.data || err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem("jwtToken");
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth redirect with JWT token
  useEffect(() => {
    // Check for token in URL (OAuth redirect)
    const query = new URLSearchParams(location.search);
    const jwtToken = query.get("token");

    if (jwtToken) {
      console.log("Token found in URL, setting token");
      setToken(jwtToken);
      localStorage.setItem("jwtToken", jwtToken);

      // Remove token from URL to prevent bookmarking issues
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      // Redirect to feed after successful login
      navigate("/feed", { replace: true });
    } else if (token) {
      // If we already have a token in state/localStorage but no user yet
      checkAuth();
    } else {
      // No token, we're not authenticated
      setLoading(false);
    }
  }, [location.search, token]);

  const login = () => {
    // Redirect to OAuth login endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if needed
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clean up local state regardless of server response
      setUser(null);
      setToken(null);
      localStorage.removeItem("jwtToken");
      navigate("/login");
    }
  };

  const value = {
    user,
    token,
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
