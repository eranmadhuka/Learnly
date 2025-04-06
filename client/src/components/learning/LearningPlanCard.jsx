import React from "react";
import { Link } from "react-router-dom";

const LearningPlanCard = ({ plan }) => {
  // Calculate progress percentage
  const completedTopics = plan.topics.filter((topic) => topic.completed).length;
  const totalTopics = plan.topics.length;
  const progressPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800">{plan.title}</h3>
      <p className="text-gray-600 mt-2">{plan.description}</p>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Topics summary */}
      <div className="mt-4">
        <p className="text-gray-700 text-sm">
          {completedTopics} of {totalTopics} topics completed
        </p>
      </div>

      {/* View details link */}
      <div className="mt-4 flex justify-end">
        <Link
          to={`/learning/plan/${plan.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default LearningPlanCard;
