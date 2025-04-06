import React, { useState } from "react";
import { useLearning } from "../../context/LearningContext";

const CreateLearningPlanForm = ({ onClose }) => {
  const { addLearningPlan } = useLearning();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [topics, setTopics] = useState([
    { title: "", description: "", resources: [], completed: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new topic field
  const addTopic = () => {
    setTopics([
      ...topics,
      { title: "", description: "", resources: [], completed: false },
    ]);
  };

  // Update topic data
  const updateTopic = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  // Add a resource to a topic
  const addResource = (topicIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].resources.push({
      title: "",
      url: "",
      type: "article",
    });
    setTopics(newTopics);
  };

  // Update resource data
  const updateResource = (topicIndex, resourceIndex, field, value) => {
    const newTopics = [...topics];
    newTopics[topicIndex].resources[resourceIndex][field] = value;
    setTopics(newTopics);
  };

  // Remove a topic
  const removeTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  // Remove a resource
  const removeResource = (topicIndex, resourceIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].resources = newTopics[topicIndex].resources.filter(
      (_, i) => i !== resourceIndex
    );
    setTopics(newTopics);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addLearningPlan({
        title,
        description,
        completionDate: completionDate ? new Date(completionDate) : null,
        topics,
      });

      // Close the form or reset it
      if (onClose) {
        onClose();
      } else {
        // Reset form
        setTitle("");
        setDescription("");
        setCompletionDate("");
        setTopics([
          { title: "", description: "", resources: [], completed: false },
        ]);
      }
    } catch (error) {
      console.error("Error creating learning plan:", error);
      // Handle error (show message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="completionDate"
          className="block text-sm font-medium text-gray-700"
        >
          Target Completion Date
        </label>
        <input
          type="date"
          id="completionDate"
          value={completionDate}
          onChange={(e) => setCompletionDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Topics</h3>
          <button
            type="button"
            onClick={addTopic}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Topic
          </button>
        </div>

        {topics.map((topic, topicIndex) => (
          <div
            key={topicIndex}
            className="border border-gray-200 rounded-md p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    value={topic.title}
                    onChange={(e) =>
                      updateTopic(topicIndex, "title", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Topic Description
                  </label>
                  <textarea
                    value={topic.description}
                    onChange={(e) =>
                      updateTopic(topicIndex, "description", e.target.value)
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeTopic(topicIndex)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700">Resources</h4>
                <button
                  type="button"
                  onClick={() => addResource(topicIndex)}
                  className="inline-flex items-center px-2 py-1 text-xs border border-transparent font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Add Resource
                </button>
              </div>

              {topic.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="flex space-x-2 items-end">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Resource Title"
                      value={resource.title}
                      onChange={(e) =>
                        updateResource(
                          topicIndex,
                          resourceIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="URL"
                      value={resource.url}
                      onChange={(e) =>
                        updateResource(
                          topicIndex,
                          resourceIndex,
                          "url",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <select
                      value={resource.type}
                      onChange={(e) =>
                        updateResource(
                          topicIndex,
                          resourceIndex,
                          "type",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="book">Book</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeResource(topicIndex, resourceIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Learning Plan"}
        </button>
      </div>
    </form>
  );
};

export default CreateLearningPlanForm;
