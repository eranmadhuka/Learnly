import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Profile from "./pages/private/Profile";
import Feed from "./pages/private/Feed";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Register from "./pages/public/Register";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LearningPlans from "./pages/private/LearningPlans";
import CreateLearningPlan from "./components/learning/CreateLearningPlan";
import EditLearningPlan from "./components/learning/EditLearningPlan";
import ProgressUpdateForm from "./components/learning/ProgressUpdateForm";
import EditProgressUpdate from "./components/learning/EditProgressUpdate";
import CommunitiesPage from "./pages/private/CommunitiesPage";

function App() {
  const { user, loading } = useAuth();
  const userId = user?.id || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
      </div>
      <Footer />
    </div>
  );
}

export default App;
