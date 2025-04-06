package com.app.learnly.services;

import com.app.learnly.models.LearningPlan;
import com.app.learnly.repositories.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        learningPlan.setCreatedAt(new Date());
        learningPlan.setUpdatedAt(new Date());
        return learningPlanRepository.save(learningPlan);

    }

    public List<LearningPlan> getLearningPlansByUserId(String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan updatedPlan) {
        Optional<LearningPlan> existingPlan = learningPlanRepository.findById(id);

        if (existingPlan.isPresent()) {
            LearningPlan plan = existingPlan.get();

            // Update fields but keep original ID and creation date
            updatedPlan.setId(id);
            updatedPlan.setCreatedAt(plan.getCreatedAt());
            updatedPlan.setUpdatedAt(new Date());

            return learningPlanRepository.save(updatedPlan);
        }

        return null;
    }

    public boolean deleteLearningPlan(String id) {
        Optional<LearningPlan> plan = learningPlanRepository.findById(id);

        if (plan.isPresent()) {
            learningPlanRepository.deleteById(id);
            return true;
        }

        return false;
    }

}
