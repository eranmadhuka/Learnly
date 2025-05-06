import React from "react";

const EditProfile = ({
  profileUser,
  formData,
  setFormData,
  API_BASE_URL,
  handleEditProfile,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, picture: reader.result, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: profileUser.name || "",
      bio: profileUser.bio || "",
      picture: profileUser.picture || "",
      file: null,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={
                formData.picture ||
                profileUser.picture ||
                "https://via.placeholder.com/150"
              }
              alt="Profile Preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-amber-200"
            />
            {formData.picture && (
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    picture: "",
                    file: null,
                  })
                }
                className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 transition duration-200"
            />
          </div>
        </div>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
            placeholder="Your name"
          />
        </div>
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
            rows="4"
            placeholder="Tell us about yourself"
          />
        </div>
        {/* Save/Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200"
          >
            Reset
          </button>
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
