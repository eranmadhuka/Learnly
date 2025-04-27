import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useLearning } from "../../context/LearningContext";
import { useParams, useNavigate } from "react-router-dom";

const EditLearningPlan = () => {
  const { learningPlans, editLearningPlan } = useLearning();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [plan, setPlan] = useState({
    title: "",
    description: "",
    topics: [],
    isPublic: false,
  });

  const [currentTopic, setCurrentTopic] = useState({
    title: "",
    description: "",
    resources: [],
    completed: false,
  });

  const [currentResource, setCurrentResource] = useState({
    title: "",
    url: "",
    type: "article",
  });

  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Load the initial plan data
  useEffect(() => {
    const initialPlan = learningPlans.find((plan) => plan.id === id);
    if (initialPlan) {
      setPlan({
        title: initialPlan.title || "",
        description: initialPlan.description || "",
        topics: initialPlan.topics || [],
        public: initialPlan.public || false,
      });
    } else {
      // If no plan is found, redirect
      navigate("/learning-plans");
    }
  }, [id, learningPlans, navigate]);

  const addTopic = () => {
    if (!currentTopic.title.trim()) {
      return;
    }

    setPlan((prev) => ({
      ...prev,
      topics: [...prev.topics, { ...currentTopic }],
    }));

    setCurrentTopic({
      title: "",
      description: "",
      resources: [],
      completed: false,
    });

    setShowTopicForm(false);
    setShowResourceForm(false);
  };

  const addResource = () => {
    if (!currentResource.title.trim() || !currentResource.url.trim()) {
      return;
    }

    setCurrentTopic((prev) => ({
      ...prev,
      resources: [...prev.resources, { ...currentResource }],
    }));

    setCurrentResource({ title: "", url: "", type: "article" });
  };

  const removeTopic = (index) => {
    setPlan((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const removeResourceFromTopic = (topicIndex, resourceIndex) => {
    setPlan((prev) => {
      const updatedTopics = [...prev.topics];
      updatedTopics[topicIndex].resources = updatedTopics[
        topicIndex
      ].resources.filter((_, i) => i !== resourceIndex);
      return { ...prev, topics: updatedTopics };
    });
  };

  const removeResourceFromCurrentTopic = (index) => {
    setCurrentTopic((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plan.title.trim()) {
      setFormError("Please enter a plan title");
      return;
    }

    // If there's an unfinished topic with a title, add it before submitting
    if (currentTopic.title.trim()) {
      addTopic();
    }

    if (plan.topics.length === 0) {
      setFormError("Please add at least one topic to your learning plan");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await editLearningPlan(id, plan);
      navigate("/learning-plans");
    } catch (error) {
      setFormError("Failed to update learning plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Learning Plan
          </h1>
          <button
            onClick={() => navigate("/learning-plans")}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to Plans
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plan Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Plan Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Plan Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter plan title (e.g., Learn React)"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your learning plan"
                  value={plan.description}
                  onChange={(e) =>
                    setPlan({ ...plan, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!plan.public}
                      onChange={() => setPlan({ ...plan, public: false })}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-gray-700">Private</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={plan.public}
                      onChange={() => setPlan({ ...plan, public: true })}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-gray-700">Public</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Topics</h2>
              <button
                type="button"
                onClick={() => setShowTopicForm(!showTopicForm)}
                className="flex items-center text-sm font-medium text-amber-600 hover:text-amber-800"
              >
                <span className="mr-1">
                  {showTopicForm ? "Cancel" : "Add Topic"}
                </span>
                <span className="text-lg">{showTopicForm ? "−" : "+"}</span>
              </button>
            </div>

            {/* Topic Form */}
            {showTopicForm && (
              <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="topicTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Topic Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="topicTitle"
                      type="text"
                      placeholder="Enter topic title (e.g., React Components)"
                      value={currentTopic.title}
                      onChange={(e) =>
                        setCurrentTopic({
                          ...currentTopic,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="topicDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Topic Description
                    </label>
                    <textarea
                      id="topicDescription"
                      placeholder="Describe this topic"
                      value={currentTopic.description}
                      onChange={(e) =>
                        setCurrentTopic({
                          ...currentTopic,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                      rows="2"
                    />
                  </div>

                  {/* Resources */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-medium text-gray-700">
                        Resources
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowResourceForm(!showResourceForm)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="mr-1">
                          {showResourceForm ? "Cancel" : "Add Resource"}
                        </span>
                        <span>{showResourceForm ? "−" : "+"}</span>
                      </button>
                    </div>

                    {/* Resource Form */}
                    {showResourceForm && (
                      <div className="p-3 bg-white border border-gray-200 rounded-md mb-3">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Resource Title
                            </label>
                            <input
                              type="text"
                              placeholder="Enter resource title"
                              value={currentResource.title}
                              onChange={(e) =>
                                setCurrentResource({
                                  ...currentResource,
                                  title: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Resource URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://example.com"
                              value={currentResource.url}
                              onChange={(e) =>
                                setCurrentResource({
                                  ...currentResource,
                                  url: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Resource Type
                            </label>
                            <select
                              value={currentResource.type}
                              onChange={(e) =>
                                setCurrentResource({
                                  ...currentResource,
                                  type: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            >
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="book">Book</option>
                              <option value="course">Course</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={addResource}
                              className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Add Resource
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Current Topic Resources List */}
                    {currentTopic.resources.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {currentTopic.resources.map((resource, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                          >
                            <div className="flex items-center">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  resource.type === "video"
                                    ? "bg-red-500"
                                    : resource.type === "article"
                                    ? "bg-blue-500"
                                    : resource.type === "book"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                                }`}
                              ></span>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {resource.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {resource.url}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeResourceFromCurrentTopic(index)
                              }
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <span className="sr-only">Remove</span>×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={addTopic}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Save Topic
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Topic List */}
            {plan.topics.length > 0 ? (
              <div className="space-y-4">
                {plan.topics.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800">
                        {topic.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        aria-label="Remove topic"
                      >
                        ×
                      </button>
                    </div>

                    <div className="p-4">
                      {topic.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {topic.description}
                        </p>
                      )}

                      {topic.resources.length > 0 ? (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Resources ({topic.resources.length})
                          </h4>
                          <div className="space-y-2">
                            {topic.resources.map((resource, resIndex) => (
                              <div
                                key={resIndex}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                      resource.type === "video"
                                        ? "bg-red-500"
                                        : resource.type === "article"
                                        ? "bg-blue-500"
                                        : resource.type === "book"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                    }`}
                                  ></span>
                                  <div>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {resource.title}
                                    </a>
                                    <span className="text-gray-500 text-xs ml-2">
                                      ({resource.type})
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeResourceFromTopic(index, resIndex)
                                  }
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <span className="sr-only">Remove</span>×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No resources added
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  No topics added yet. Add topics to update your learning plan.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/learning-plans")}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors font-medium flex items-center justify-center min-w-32 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Learning Plan"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditLearningPlan;
