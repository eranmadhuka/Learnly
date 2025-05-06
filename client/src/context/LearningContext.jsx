import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const LearningContext = createContext();

export const useLearning = () => useContext(LearningContext);

export const LearningProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [learningPlans, setLearningPlans] = useState([]);
  const [publicPlans, setPublicPlans] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id || !token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [userPlansResponse, publicPlansResponse, updatesResponse] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/plans/user/${user.id}`),
            axios.get(`${API_BASE_URL}/api/plans/public`),
            axios.get(`${API_BASE_URL}/api/progress/user/${user.id}`),
          ]);

        setLearningPlans(userPlansResponse.data);
        setPublicPlans(
          publicPlansResponse.data.filter((plan) => plan.userId !== user.id)
        );
        setProgressUpdates(updatesResponse.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching learning data:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized: Please log in again");
        } else if (error.response?.status === 404) {
          setError("No learning plans or progress found");
          setLearningPlans([]);
          setProgressUpdates([]);
        } else {
          setError("Error fetching learning data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, API_BASE_URL]);

  const addLearningPlan = async (planData) => {
    if (!user || !user.id) throw new Error("User not authenticated");
    if (!planData.title) throw new Error("Plan title is required");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/plans`, planData);
      const newPlan = response.data;
      setLearningPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (error) {
      console.error("Error adding learning plan:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create learning plan"
      );
    }
  };

  const editLearningPlan = async (planId, planData) => {
    if (!user || !user.id) throw new Error("User not authenticated");
    if (!planId || !planData.title) throw new Error("Invalid plan data");

    try {
      const response = await axios.put(`${API_BASE_URL}/api/plans/${planId}`, {
        ...planData,
        userId: user.id,
      });
      const updatedPlan = response.data;
      setLearningPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? updatedPlan : plan))
      );
      return updatedPlan;
    } catch (error) {
      console.error("Error editing learning plan:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update learning plan"
      );
    }
  };

  const importLearningPlan = async (planId) => {
    if (!user || !user.id) throw new Error("User not authenticated");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/plans/import/${planId}`
      );
      const importedPlan = response.data;
      setLearningPlans((prev) => [...prev, importedPlan]);
      return importedPlan;
    } catch (error) {
      console.error("Error importing learning plan:", error);
      throw new Error(
        error.response?.data?.message || "Failed to import learning plan"
      );
    }
  };

  const removeLearningPlan = async (planId) => {
    if (!user || !user.id) throw new Error("User not authenticated");
    if (!planId) throw new Error("Plan ID is required");

    try {
      await axios.delete(`${API_BASE_URL}/api/plans/${planId}`);
      setLearningPlans((prev) => prev.filter((plan) => plan.id !== planId));
      return true;
    } catch (error) {
      console.error("Error removing learning plan:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete learning plan"
      );
    }
  };

  const addProgressUpdate = async (updateData) => {
    if (!user || !user.id) throw new Error("User not authenticated");
    if (!updateData.learningPlanId || !updateData.title)
      throw new Error("Invalid update data");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/progress`, {
        ...updateData,
        userId: user.id,
      });
      const newUpdate = response.data;
      setProgressUpdates((prev) => [...prev, newUpdate]);
      return newUpdate;
    } catch (error) {
      console.error("Error adding progress update:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create progress update"
      );
    }
  };

  const editProgressUpdate = async (updateId, updateData) => {
    if (!user || !user.id) throw new Error("User not authenticated");
    if (!updateId) throw new Error("Update ID is required");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/progress/${updateId}`,
        { ...updateData, userId: user.id }
      );
      const updatedUpdate = response.data;
      setProgressUpdates((prev) =>
        prev.map((update) => (update.id === updateId ? updatedUpdate : update))
      );
      return updatedUpdate;
    } catch (error) {
      console.error("Error editing progress update:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update progress update"
      );
    }
  };

  const removeProgressUpdate = async (updateId) => {
    if (!user || !user.id) throw new Error("User not authenticated");
    if (!updateId) throw new Error("Update ID is required");

    try {
      await axios.delete(`${API_BASE_URL}/api/progress/${updateId}`);
      setProgressUpdates((prev) =>
        prev.filter((update) => update.id !== updateId)
      );
      return true;
    } catch (error) {
      console.error("Error removing progress update:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete progress update"
      );
    }
  };

  const value = {
    learningPlans,
    publicPlans,
    progressUpdates,
    loading,
    error,
    addLearningPlan,
    editLearningPlan,
    importLearningPlan,
    removeLearningPlan,
    addProgressUpdate,
    editProgressUpdate,
    removeProgressUpdate,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
