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
        if (token && !config.url.includes("/api/plans/public")) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Check authentication status
  const checkAuth = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log("Checking authentication with token");
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Auth response:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Auth check failed:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("jwtToken");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth redirect with JWT token
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const jwtToken = query.get("token");

    if (jwtToken) {
      console.log("Token found in URL, setting token");
      setToken(jwtToken);
      localStorage.setItem("jwtToken", jwtToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/feed", { replace: true });
    }

    if (token && !user) {
      checkAuth();
    } else if (!token) {
      setLoading(false);
    }
  }, [location.search, token, navigate]);

  const login = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
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
