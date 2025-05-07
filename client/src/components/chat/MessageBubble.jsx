const MessageBubble = ({ message, userId }) => {
  const isOwnMessage = message.senderId === userId;
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" class="text-amber-600 underline hover:text-amber-800">${url}</a>`
    );
  };

  return (
    <div
      className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      {!isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center mr-2 mt-1 text-xs font-bold text-amber-800">
          {message.senderName
            ? message.senderName.charAt(0).toUpperCase()
            : "U"}
        </div>
      )}
      <div className="max-w-xs">
        <div
          className={`p-3 rounded-lg ${
            isOwnMessage
              ? "bg-amber-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
          dangerouslySetInnerHTML={{ __html: renderContent(message.content) }}
        />
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isOwnMessage ? "text-right" : "text-left"
          }`}
        >
          {timestamp}
          {isOwnMessage && (
            <span className="ml-1">
              {message.status === "sent" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                >
                  <path d="M18 6L7 17l-5-5"></path>
                  <path d="M16 6l-9 9-5-5"></path>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
      {isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center ml-2 mt-1 text-xs font-bold text-white">
          {message.senderName
            ? message.senderName.charAt(0).toUpperCase()
            : "U"}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
