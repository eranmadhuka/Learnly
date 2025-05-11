import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/images/logo1.png";
import UserImg from "../../assets/images/user.png";

const Header = ({ onMenuToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setDropdownOpen(false);
      navigate("/login");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                onClick={onMenuToggle}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
            <Link to="/" className="flex-shrink-0">
              <img className="h-10 sm:h-10 w-auto" src={Logo} alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  disabled={loading}
                >
                  <span className="hidden md:inline text-sm font-medium text-gray-700 truncate">
                    {user.name}
                  </span>
                  {imageLoading && (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={user.picture ? user.picture : UserImg}
                    alt="User Avatar"
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-gray-200 ${
                      imageLoading ? "hidden" : "block"
                    }`}
                    onLoad={handleImageLoad}
                    onError={() => setImageLoading(false)}
                  />
                </button>
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform transition-all duration-200 ease-in-out origin-top-right scale-95 opacity-0 animate-dropdown">
                      <Link
                        to={`/profile/${user.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/update-profile"
                        className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                        disabled={loading}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-md font-normal text-gray-600 hover:bg-amber-50 rounded-full transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-full transition-colors duration-200"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-in-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
