import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chrome, Github, Twitter } from "lucide-react";

export default function Login() {
  const { user, login, loading } = useAuth(); // Added login from context
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/feed");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to <span className="text-amber-500">Learnly</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Where skills are shared and knowledge flourishe
          </p>
        </div>

        <div className="mt-8">
          <div className="space-y-4">
            <button
              onClick={() => login("google")}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Sign in with Google
            </button>

            <button
              onClick={() => login("github")}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Github className="w-5 h-5 mr-3" />
              Sign in with GitHub
            </button>

            <button
              onClick={() => login("twitter")}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Twitter className="w-5 h-5 mr-3" />
              Sign in with Twitter
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <a href="#" className="text-amber-500 hover:text-amber-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-amber-500 hover:text-amber-600">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
