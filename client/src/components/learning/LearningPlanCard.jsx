import React from "react";
import { useLearning } from "../../context/LearningContext";

const LearningPlanCard = ({ plan }) => {
  const { progressUpdates } = useLearning();

  const latestUpdate = progressUpdates
    .filter((update) => update.learningPlanId === plan.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const latestCompletedTopic = plan.topics
    .filter((topic) => topic.completed)
    .slice(-1)[0];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Same day
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Within the last 7 days
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    if (date > oneWeekAgo) {
      return (
        date.toLocaleDateString([], { weekday: "long" }) +
        ` at ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    }

    // Default format for older dates
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (!latestUpdate && !latestCompletedTopic) {
    return (
      <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 flex items-center justify-center rounded-full mb-3">
            <svg
              className="w-8 h-8"
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
          </div>
          <p className="text-gray-600 mb-3">No progress updates yet</p>
          <button
            onClick={() =>
              (window.location.href = `/progress-update/${plan.id}`)
            }
            className="text-amber-500 hover:text-amber-600 font-medium flex items-center"
          >
            <span>Add your first update</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-100">
      {latestUpdate && (
        <div className="p-5">
          <div className="flex items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-amber-100 text-amber-500 flex items-center justify-center rounded-full text-xl font-bold mr-4">
              {plan.title.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {latestCompletedTopic && (
                <div className="bg-green-100 text-green-800 text-xs rounded-full px-3 py-1 inline-block mb-2">
                  Topic Completed
                </div>
              )}
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                {latestCompletedTopic
                  ? `${latestCompletedTopic.title} Complete!`
                  : latestUpdate.title}
              </h4>
              <p className="text-gray-600 mb-3">{latestUpdate.content}</p>

              {/* Media attachments if any */}
              {latestUpdate.mediaUrls && latestUpdate.mediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {latestUpdate.mediaUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        ></path>
                      </svg>
                      Attachment {idx + 1}
                    </a>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      plan.isPublic ? "bg-green-500" : "bg-gray-500"
                    } mr-1`}
                  ></span>
                  <span>{plan.isPublic ? "Public" : "Private"}</span>
                </div>
                <time dateTime={latestUpdate.createdAt}>
                  {formatDate(latestUpdate.createdAt)}
                </time>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPlanCard;
