// src/pages/private/LearningPlans.jsx
import React from "react";
import { useLearning } from "../../context/LearningContext";
import LearningPlanCard from "../../components/learning/LearningPlanCard";
import CreateLearningPlanForm from "../../components/learning/LearningPlanForm";
import DashboardLayout from "../../components/layout/DashboardLayout";

const LearningPlans = () => {
  const { learningPlans, loading, addLearningPlan } = useLearning();

  const handleCreatePlan = async (planData) => {
    try {
      await addLearningPlan(planData);
    } catch (error) {
      alert("Failed to create learning plan. Please try again.");
    }
  };

  //   if (loading) {
  //     return (
  //       <div className="max-w-4xl mx-auto p-4">
  //         <div className="text-center text-gray-600">
  //           Loading your learning plans...
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Learning Plans
        </h1>

        {/* Create New Learning Plan Form */}
        <CreateLearningPlanForm onSubmit={handleCreatePlan} />

        {/* List of Learning Plans */}
        <div className="space-y-6 mt-8">
          {learningPlans.length === 0 ? (
            <p className="text-gray-600 text-center">
              You haven't created any learning plans yet. Start by adding one
              above!
            </p>
          ) : (
            learningPlans.map((plan) => (
              <LearningPlanCard key={plan.id} plan={plan} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningPlans;
