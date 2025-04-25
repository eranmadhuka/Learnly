import React, { useEffect, useRef } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "max-w-md",
  showCloseButton = true,
  closeOnOutsideClick = true,
}) => {
  const modalRef = useRef(null);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle clicking outside the modal
  const handleOutsideClick = (event) => {
    if (
      closeOnOutsideClick &&
      modalRef.current &&
      !modalRef.current.contains(event.target)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="fixed inset-0" onClick={handleOutsideClick}></div>

      <div
        ref={modalRef}
        className={`relative z-50 ${maxWidth} w-full rounded-lg bg-white shadow-xl transition-all duration-300 ease-in-out`}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Modal content */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
