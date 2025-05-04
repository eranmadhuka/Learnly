const MessageBubble = ({ message, userId }) => {
  const isOwnMessage = message.senderId === userId;

  const renderContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" class="text-indigo-600 underline">${url}</a>`
    );
  };

  return (
    <div
      className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isOwnMessage
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
        dangerouslySetInnerHTML={{ __html: renderContent(message.content) }}
      />
    </div>
  );
};

export default MessageBubble;
