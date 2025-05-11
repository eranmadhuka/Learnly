import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MessageCircleMore,
  Bell,
  BookMarked,
  BookOpenCheck,
  Handshake,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import UserImg from "../../assets/images/user.png";

const Sidebar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  // Fetch user's posts
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     if (!user) return;

  //     try {
  //       setIsLoadingPosts(true);
  //       const response = await axios.get(
  //         `${API_BASE_URL}/api/posts/user/${user.id}`,
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       setPosts(response.data);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //       setPosts([]);
  //     } finally {
  //       setIsLoadingPosts(false);
  //     }
  //   };

  //   fetchPosts();
  // }, [user, API_BASE_URL]);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-amber-50 text-amber-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100";

  if (loading) {
    return (
      <aside className="flex flex-col w-64 bg-white border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="h-16 bg-gray-200 animate-pulse rounded-t-lg"></div>
          <div className="flex justify-center -mt-10">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        </div>
      </aside>
    );
  }

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <aside className="flex flex-col w-64 bg-white border border-gray-100 shadow-sm overflow-y-auto">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-100 text-center">
        <div className="relative mb-3">
          <div className="h-16 rounded-t-lg bg-gradient-to-r from-blue-100 to-purple-100"></div>
          <div
            className="absolute w-full flex justify-center"
            style={{ top: "50%" }}
          >
            <div className="w-20 h-20 rounded-full border-3 border-white overflow-hidden flex items-center justify-center">
              <img
                src={user.picture || UserImg}
                alt="User Avatar"
                className="h-full w-full rounded-full object-cover border border-gray-200"
              />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="font-bold text-lg">{user.name || "User"}</h2>
          <p className="text-sm text-gray-600">{user.email || ""}</p>
          <p className="text-xs mt-2 text-gray-500 italic">
            {user.bio || "No bio yet"}
          </p>
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <div>
            <p className="font-bold">{isLoadingPosts ? "..." : posts.length}</p>
            <p className="text-gray-600 text-xs">Posts</p>
          </div>
          <div>
            <p className="font-bold">{user.followers?.length || 0}</p>
            <p className="text-gray-600 text-xs">Followers</p>
          </div>
          <div>
            <p className="font-bold">{user.following?.length || 0}</p>
            <p className="text-gray-600 text-xs">Following</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/feed"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/feed"
              )}`}
            >
              <Home size={20} />
              <span>Feed</span>
            </Link>
          </li>
          <li>
            <Link
              to="/friends"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/friends"
              )}`}
            >
              <Handshake size={20} />
              <span>Friends</span>
            </Link>
          </li>
          <li>
            <Link
              to="/peoples"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/peoples"
              )}`}
            >
              <Users size={20} />
              <span>Peoples</span>
            </Link>
          </li>
          <li>
            <Link
              to="/learning-plans"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/learning-plans"
              )}`}
            >
              <BookOpenCheck size={20} />
              <span>Learning Plans</span>
            </Link>
          </li>
          <li>
            <Link
              to="/communities"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/communities"
              )}`}
            >
              <MessageCircleMore size={20} />
              <span>Communities</span>
            </Link>
          </li>
          {/* <li>
            <Link
              to="/saved-posts"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/saved-posts"
              )}`}
            >
              <BookMarked size={20} />
              <span>Saved</span>
            </Link>
          </li> */}
          <li>
            <Link
              to="/notifications"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/notifications"
              )}`}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </Link>
          </li>
          {/* <li>
            <Link
              to="/update-profile"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/update-profile"
              )}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li> */}
        </ul>
      </nav>

      {/* View Profile Button */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to={`/profile/${user.id}`}
          className="block text-center text-amber-500 hover:text-amber-600 transition-colors text-sm"
        >
          View Profile
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
