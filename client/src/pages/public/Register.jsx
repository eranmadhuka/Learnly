import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Chrome, Github, Twitter, ArrowLeft } from "lucide-react";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (provider) => {
    try {
      setError("");
      await login(provider);
      navigate("/feed");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Join <span className="text-amber-500">Learnly</span> Today
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Start sharing your skills and learning from others
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="space-y-4">
            <button
              onClick={() => handleRegister("google")}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Sign up with Google
            </button>

            <button
              onClick={() => handleRegister("github")}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled
            >
              <Github className="w-5 h-5 mr-3" />
              Sign up with GitHub
            </button>

            <button
              onClick={() => handleRegister("twitter")}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled
            >
              <Twitter className="w-5 h-5 mr-3" />
              Sign up with Twitter
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <a href="#" className="text-amber-500 hover:text-amber-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-amber-500 hover:text-amber-600">
                Privacy Policy
              </a>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-amber-500 hover:text-amber-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-amber-500 hover:text-amber-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
