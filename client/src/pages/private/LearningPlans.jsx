import React, { useState } from "react";
import { useLearning } from "../../context/LearningContext";
import LearningPlanCard from "../../components/learning/LearningPlanCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

const LearningPlans = () => {
  const {
    learningPlans,
    publicPlans,
    progressUpdates,
    loading,
    editLearningPlan,
    importLearningPlan,
    removeLearningPlan,
  } = useLearning();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("myPlans"); // "myPlans" or "publicPlans"
  const navigate = useNavigate();

  const calculateProgress = (plan) => {
    if (!plan.topics || plan.topics.length === 0) return 0;
    const completedTopics = plan.topics.filter(
      (topic) => topic.completed
    ).length;
    return Math.round((completedTopics / plan.topics.length) * 100);
  };

  const toggleTopicCompletion = async (planId, topicIndex) => {
    if (!selectedPlan) return;

    const updatedTopics = selectedPlan.topics.map((topic, index) =>
      index === topicIndex ? { ...topic, completed: !topic.completed } : topic
    );
    const updatedPlan = { ...selectedPlan, topics: updatedTopics };

    try {
      await editLearningPlan(planId, updatedPlan);
      setSelectedPlan(updatedPlan);
    } catch (error) {
      alert("Failed to update topic completion: " + error.message);
    }
  };

  const handleDelete = async (planId) => {
    try {
      await removeLearningPlan(planId);
      setSelectedPlan(null);
      alert("Learning plan deleted successfully!");
    } catch (error) {
      alert("Failed to delete learning plan");
    }
  };

  const handleImport = async (planId) => {
    try {
      await importLearningPlan(planId);
      setActiveTab("myPlans");
      alert("Plan imported successfully!");
    } catch (error) {
      alert("Failed to import plan: " + error.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your learning plans...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredProgressUpdates = selectedPlan
    ? progressUpdates.filter(
        (update) => update.learningPlanId === selectedPlan.id
      )
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Learning Plans</h1>
          <Link to="/create-learning-plan">
            <button className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Create New Plan
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex -mb-px">
            <button
              onClick={() => setActiveTab("myPlans")}
              className={`py-3 px-4 font-medium border-b-2 ${
                activeTab === "myPlans"
                  ? "text-amber-500 border-amber-500"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              My Plans ({learningPlans.length})
            </button>
            <button
              onClick={() => setActiveTab("publicPlans")}
              className={`py-3 px-4 font-medium border-b-2 ${
                activeTab === "publicPlans"
                  ? "text-amber-500 border-amber-500"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Discover Public Plans ({publicPlans.length})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Plan List */}
          <div className="md:w-1/3 space-y-4">
            {activeTab === "myPlans" ? (
              // My Plans List
              learningPlans.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">
                    You don't have any learning plans yet.
                  </p>
                  <Link to="/create-learning-plan">
                    <button className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors">
                      Create Your First Plan
                    </button>
                  </Link>
                </div>
              ) : (
                learningPlans.map((plan) => {
                  const progress = calculateProgress(plan);
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-4 rounded-lg cursor-pointer transition-all shadow-sm ${
                        selectedPlan?.id === plan.id
                          ? "bg-white border-2 border-amber-500 shadow-md"
                          : "bg-white border border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {plan.title}
                        </h2>
                        {plan.isPublic && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Public
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {plan.description || "No description provided"}
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{plan.topics.length} topics</span>
                          <span className="font-medium">
                            {progress}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : // Public Plans List
            publicPlans.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600">No public plans available yet.</p>
              </div>
            ) : (
              publicPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {plan.title}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {plan.followers?.length || 0} users
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 mb-4 line-clamp-2">
                    {plan.description || "No description provided"}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.topics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-xs px-2 py-1 rounded"
                      >
                        {topic.title}
                      </span>
                    ))}
                    {plan.topics.length > 3 && (
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                        +{plan.topics.length - 3} more
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleImport(plan.id)}
                    className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      ></path>
                    </svg>
                    Add to My Plans
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right Side: Selected Plan Details */}
          <div className="md:w-2/3">
            {activeTab === "myPlans" && selectedPlan ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Plan Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedPlan.title}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/edit-learning-plan/${selectedPlan.id}`)
                        }
                        className="text-gray-600 hover:text-amber-500 p-2 rounded-full hover:bg-gray-100"
                        title="Edit Plan"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(selectedPlan.id)}
                        className="text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
                        title="Delete Plan"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        Your Progress
                      </span>
                      <span className="font-medium">
                        {calculateProgress(selectedPlan)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-amber-500 h-2.5 rounded-full"
                        style={{ width: `${calculateProgress(selectedPlan)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-600">{selectedPlan.description}</p>
                  </div>
                </div>

                {/* Plan Content Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button className="py-3 px-4 font-medium text-amber-500 border-b-2 border-amber-500">
                      Topics
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/progress-update/${selectedPlan.id}`)
                      }
                      className="py-3 px-4 font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700"
                    >
                      Post Update
                    </button>
                  </nav>
                </div>

                {/* Topics List */}
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedPlan.topics.map((topic, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`topic-${index}`}
                              checked={topic.completed}
                              onChange={() =>
                                toggleTopicCompletion(selectedPlan.id, index)
                              }
                              className="h-5 w-5 text-amber-500 rounded focus:ring-amber-500"
                            />
                            <label
                              htmlFor={`topic-${index}`}
                              className={`ml-3 ${
                                topic.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              } font-medium cursor-pointer`}
                            >
                              {topic.title}
                            </label>
                          </div>
                          <button
                            className="text-gray-400 hover:text-gray-600 p-1"
                            onClick={() => {
                              const element = document.getElementById(
                                `resources-${index}`
                              );
                              element.classList.toggle("hidden");
                            }}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </button>
                        </div>

                        {/* Resources */}
                        <div
                          id={`resources-${index}`}
                          className="hidden mt-4 pl-8"
                        >
                          {topic.resources.length > 0 ? (
                            <div className="space-y-2">
                              {topic.resources.map((resource, resourceIdx) => (
                                <div
                                  key={resourceIdx}
                                  className="flex items-center"
                                >
                                  <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-bold
                                    ${
                                      resource.type === "video"
                                        ? "bg-red-500"
                                        : resource.type === "article"
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                    }`}
                                  >
                                    {resource.type.charAt(0).toUpperCase()}
                                  </div>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm hover:underline text-blue-600"
                                  >
                                    {resource.title}
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No resources for this topic
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Progress Update */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Latest Progress
                  </h3>
                  <LearningPlanCard plan={selectedPlan} />
                </div>

                {/* Progress Updates */}
                {filteredProgressUpdates.length > 0 && (
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Your Progress Updates
                    </h3>
                    <div className="space-y-4">
                      {filteredProgressUpdates
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .slice(0, 3)
                        .map((update) => (
                          <div
                            key={update.id}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-gray-800">
                              {update.title}
                            </h4>
                            <p className="text-gray-600 mt-1">
                              {update.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Posted on:{" "}
                              {new Date(update.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      {filteredProgressUpdates.length > 3 && (
                        <button className="text-amber-500 hover:text-amber-600 font-medium text-sm">
                          View all {filteredProgressUpdates.length} updates
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center h-64">
                <img
                  src="/api/placeholder/150/150"
                  alt="Select a plan"
                  className="w-24 h-24 mb-4 opacity-50"
                />
                <p className="text-gray-500 text-lg">
                  {activeTab === "myPlans"
                    ? "Select a learning plan to view details"
                    : "Browse public learning plans to add to your collection"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningPlans;
