import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const LearningContext = createContext();

export const useLearning = () => useContext(LearningContext);

export const LearningProvider = ({ children }) => {
  const { user } = useAuth();
  const [learningPlans, setLearningPlans] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        setLoading(true);
        try {
          const [plansResponse, updatesResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/plans/${user._id}`, {
              withCredentials: true,
            }),
            axios.get(`${API_BASE_URL}/api/progress/${user._id}`, {
              withCredentials: true,
            }),
          ]);

          setLearningPlans(plansResponse.data);
          setProgressUpdates(updatesResponse.data);
        } catch (error) {
          console.error("Error fetching learning data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const addLearningPlan = async (planData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/plans`,
        { ...planData, userId: user._id },
        { withCredentials: true }
      );
      const newPlan = response.data;
      setLearningPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (error) {
      console.error("Error creating learning plan:", error);
      throw error;
    }
  };

  const editLearningPlan = async (planId, planData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/plans/${planId}`,
        { ...planData, userId: user._id },
        { withCredentials: true }
      );
      const updatedPlan = response.data;
      setLearningPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? updatedPlan : plan))
      );
      return updatedPlan;
    } catch (error) {
      console.error("Error updating learning plan:", error);
      throw error;
    }
  };

  const removeLearningPlan = async (planId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/plans/${planId}`, {
        withCredentials: true,
      });
      setLearningPlans((prev) => prev.filter((plan) => plan.id !== planId));
      return true;
    } catch (error) {
      console.error("Error deleting learning plan:", error);
      throw error;
    }
  };

  const addProgressUpdate = async (updateData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/progress`,
        { ...updateData, userId: user._id },
        { withCredentials: true }
      );
      const newUpdate = response.data;
      setProgressUpdates((prev) => [...prev, newUpdate]);
      return newUpdate;
    } catch (error) {
      console.error("Error creating progress update:", error);
      throw error;
    }
  };

  const editProgressUpdate = async (updateId, updateData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/progress/${updateId}`,
        { ...updateData, userId: user._id },
        { withCredentials: true }
      );
      const updatedUpdate = response.data;
      setProgressUpdates((prev) =>
        prev.map((update) => (update.id === updateId ? updatedUpdate : update))
      );
      return updatedUpdate;
    } catch (error) {
      console.error("Error updating progress update:", error);
      throw error;
    }
  };

  const removeProgressUpdate = async (updateId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/progress/${updateId}`, {
        withCredentials: true,
      });
      setProgressUpdates((prev) =>
        prev.filter((update) => update.id !== updateId)
      );
      return true;
    } catch (error) {
      console.error("Error deleting progress update:", error);
      throw error;
    }
  };

  const value = {
    learningPlans,
    progressUpdates,
    loading,
    addLearningPlan,
    editLearningPlan,
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
