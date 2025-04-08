import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />

            {/* Learning plans Routes */}
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
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
