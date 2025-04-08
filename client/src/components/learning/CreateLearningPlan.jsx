import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useLearning } from "../../context/LearningContext";

const CreateLearningPlan = () => {
  const { addLearningPlan } = useLearning();

  const [newPlan, setNewPlan] = useState({
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

  const addTopic = () => {
    if (currentTopic.title.trim()) {
      setNewPlan((prev) => ({
        ...prev,
        topics: [...prev.topics, { ...currentTopic }],
      }));
      setCurrentTopic({
        title: "",
        description: "",
        resources: [],
        completed: false,
      });
      setCurrentResource({ title: "", url: "", type: "article" });
    }
  };

  const addResource = () => {
    if (currentResource.title.trim() && currentResource.url.trim()) {
      setCurrentTopic((prev) => ({
        ...prev,
        resources: [...prev.resources, { ...currentResource }],
      }));
      setCurrentResource({ title: "", url: "", type: "article" });
    }
  };

  const removeTopic = (index) => {
    setNewPlan((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const removeResourceFromTopic = (topicIndex, resourceIndex) => {
    setNewPlan((prev) => {
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
    if (!newPlan.title.trim()) return;

    // Add current topic if it exists before submitting
    if (currentTopic.title.trim()) {
      addTopic();
    }

    try {
      await addLearningPlan(newPlan);
      setNewPlan({ title: "", description: "", topics: [] });
      setCurrentTopic({
        title: "",
        description: "",
        resources: [],
        completed: false,
      });
      setCurrentResource({ title: "", url: "", type: "article" });
    } catch (error) {
      alert("Failed to create learning plan. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Learning Plan
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow"
        >
          {/* Plan Details */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter plan title (e.g., Learn React)"
                value={newPlan.title}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, title: e.target.value })
                }
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your learning plan (optional)"
                value={newPlan.description}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, description: e.target.value })
                }
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                rows="3"
              />
            </div>
          </div>

          {/* Topic Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Topics
            </h2>
            <div className="space-y-4 bg-gray-50 p-4 rounded-md">
              <div>
                <label
                  htmlFor="topicTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Topic Title
                </label>
                <input
                  id="topicTitle"
                  type="text"
                  placeholder="Enter topic title (e.g., React Components)"
                  value={currentTopic.title}
                  onChange={(e) =>
                    setCurrentTopic({ ...currentTopic, title: e.target.value })
                  }
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="topicDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Topic Description
                </label>
                <textarea
                  id="topicDescription"
                  placeholder="Describe this topic (optional)"
                  value={currentTopic.description}
                  onChange={(e) =>
                    setCurrentTopic({
                      ...currentTopic,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  rows="2"
                />
              </div>

              {/* Resource Section */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-gray-700">Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-2">
                  <input
                    type="text"
                    placeholder="Resource title"
                    value={currentResource.title}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        title: e.target.value,
                      })
                    }
                    className="p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                  <input
                    type="url"
                    placeholder="Resource URL"
                    value={currentResource.url}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        url: e.target.value,
                      })
                    }
                    className="p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                  <select
                    value={currentResource.type}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        type: e.target.value,
                      })
                    }
                    className="p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="book">Book</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addResource}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Resource
                </button>

                {/* Current Topic Resources */}
                {currentTopic.resources.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {currentTopic.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded-md border"
                      >
                        <div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {resource.title}
                          </a>
                          <span className="text-gray-500 text-sm ml-2">
                            ({resource.type})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeResourceFromCurrentTopic(index)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addTopic}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Topic
              </button>
            </div>
          </div>

          {/* Added Topics */}
          {newPlan.topics.length > 0 && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Topics
              </h2>
              <div className="space-y-4">
                {newPlan.topics.map((topic, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {topic.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                    {topic.resources.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Resources:
                        </h4>
                        {topic.resources.map((resource, resIndex) => (
                          <div
                            key={resIndex}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                          >
                            <div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {resource.title}
                              </a>
                              <span className="text-gray-500 text-sm ml-2">
                                ({resource.type})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeResourceFromTopic(index, resIndex)
                              }
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Visibility
            </label>
            <select
              value={newPlan.isPublic}
              onChange={(e) =>
                setNewPlan({ ...newPlan, isPublic: e.target.value === "true" })
              }
              className="mt-1 w-full p-3 border rounded-md focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="false">Private</option>
              <option value="true">Public</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-white p-3 rounded-md hover:bg-amber-600 transition-colors font-medium"
          >
            Create Learning Plan
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateLearningPlan;
