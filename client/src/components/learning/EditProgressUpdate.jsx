import React, { useState, useEffect } from "react";
import { useLearning } from "../../context/LearningContext";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const EditProgressUpdate = () => {
  const { progressUpdates, editProgressUpdate } = useLearning();
  const { progressId, learningPlanId } = useParams();
  const navigate = useNavigate();

  const [update, setUpdate] = useState({
    learningPlanId,
    title: "",
    content: "",
    mediaUrls: [],
    template: "general_update",
  });

  const templates = {
    completed_tutorials: "I completed tutorials on [topics].",
    new_skills: "I learned new skills: [skills].",
    general_update: "Here's my latest progress update.",
  };

  useEffect(() => {
    const fetchUpdate = () => {
      try {
        const existingUpdate = progressUpdates.find(
          (update) => update.id === progressId
        );
        if (!existingUpdate) {
          throw new Error("Progress update not found");
        }
        setUpdate({
          learningPlanId: existingUpdate.learningPlanId || learningPlanId,
          title: existingUpdate.title || "",
          content: existingUpdate.content || "",
          mediaUrls: existingUpdate.mediaUrls || [],
          template: existingUpdate.template || "general_update",
        });
      } catch (error) {
        alert("Failed to load progress update: " + error.message);
      }
    };
    fetchUpdate();
  }, [progressId, learningPlanId, progressUpdates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editProgressUpdate(progressId, update);
      navigate(`/learning-plans`);
    } catch (error) {
      alert("Failed to update: " + error.message);
    }
  };

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setUpdate((prev) => ({
      ...prev,
      template,
      content: templates[template],
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Edit Progress Update
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={update.title}
              onChange={(e) => setUpdate({ ...update, title: e.target.value })}
              className="mt-1 w-full p-3 border rounded-md focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              value={update.template}
              onChange={handleTemplateChange}
              className="mt-1 w-full p-3 border rounded-md focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="general_update">General Update</option>
              <option value="completed_tutorials">Completed Tutorials</option>
              <option value="new_skills">New Skills Learned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={update.content}
              onChange={(e) =>
                setUpdate({ ...update, content: e.target.value })
              }
              className="mt-1 w-full p-3 border rounded-md focus:ring-amber-500 focus:border-amber-500"
              rows="4"
              placeholder="Describe your progress..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media URLs (optional)
            </label>
            <input
              type="text"
              value={update.mediaUrls.join(", ")}
              onChange={(e) =>
                setUpdate({
                  ...update,
                  mediaUrls: e.target.value ? e.target.value.split(", ") : [],
                })
              }
              className="mt-1 w-full p-3 border rounded-md focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter URLs separated by commas"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-amber-500 text-white p-3 rounded-md hover:bg-amber-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/learning-plans")}
              className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProgressUpdate;
