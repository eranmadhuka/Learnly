import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Profile from "./pages/private/Profile";
import Feed from "./pages/private/Feed";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/public/Register";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LearningPlans from "./pages/private/LearningPlans";
import CreateLearningPlan from "./components/learning/CreateLearningPlan";
import EditLearningPlan from "./components/learning/EditLearningPlan";
import ProgressUpdateForm from "./components/learning/ProgressUpdateForm";
import EditProgressUpdate from "./components/learning/EditProgressUpdate";
import CommunitiesPage from "./pages/private/CommunitiesPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthRedirect() {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(() => {
      navigate("/feed");
    });
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <span className="text-lg text-gray-600">Redirecting...</span>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  const userId = user?.id || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span className="text-lg text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />

          <Route element={<PrivateRoute />}>
            {/* User Profile Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />

            {/* Learning Plans Routes */}
            <Route path="/learning-plans" element={<LearningPlans />} />
            <Route
              path="/create-learning-plan"
              element={<CreateLearningPlan />}
            />
            <Route
              path="/edit-learning-plan/:id"
              element={<EditLearningPlan />}
            />
            <Route
              path="/progress-update/:learningPlanId"
              element={<ProgressUpdateForm />}
            />
            <Route
              path="/edit-progress-update/:progressId"
              element={<EditProgressUpdate />}
            />

            {/* Feed Route */}
            <Route path="/feed" element={<Feed />} />

            {/* Communities Route */}
            <Route
              path="/communities"
              element={<CommunitiesPage userId={userId} />}
            />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
