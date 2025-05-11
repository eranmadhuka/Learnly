import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  // Function to get CSRF token from cookie
  const getCsrfToken = () => Cookies.get("XSRF-TOKEN");

  // Axios interceptor to include CSRF token for non-GET requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (["post", "put", "delete"].includes(config.method.toLowerCase())) {
          const csrfToken = getCsrfToken();
          if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
          }
        }
        config.withCredentials = true; // Ensure cookies are sent
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      console.log("Checking authentication");
      const response = await axios.get(`${API_BASE_URL}/api/auth/user`, {
        withCredentials: true,
      });
      console.log("Auth response:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Auth check failed:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth redirect and initial auth check
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const loginSuccess = query.get("loginSuccess");

    if (loginSuccess === "true") {
      console.log("OAuth login successful, checking auth");
      window.history.replaceState({}, document.title, window.location.pathname);
      checkAuth();
      navigate("/feed", { replace: true });
    } else if (!user) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [location.search, navigate]);

  const login = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      setUser(null);
      Cookies.remove("JSESSIONID");
      Cookies.remove("XSRF-TOKEN");
      navigate("/login");
    }
  };

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
