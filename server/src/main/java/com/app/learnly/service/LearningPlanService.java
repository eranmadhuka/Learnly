package com.app.learnly.service;

import com.app.learnly.model.LearningPlan;
import com.app.learnly.repository.LearningPlanRepository;
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
        return learningPlanRepository.save(learningPlan);
    }

    public List<LearningPlan> getLearningPlansByUserId(String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlan) {
        Optional<LearningPlan> existingPlan = learningPlanRepository.findById(id);
        if (existingPlan.isPresent()) {
            LearningPlan updatedPlan = existingPlan.get();
            updatedPlan.setTitle(learningPlan.getTitle());
            updatedPlan.setDescription(learningPlan.getDescription());
            updatedPlan.setTopics(learningPlan.getTopics());
            updatedPlan.setIsPublic(learningPlan.isPublic());
            updatedPlan.setUpdatedAt(learningPlan.getUpdatedAt());
            return learningPlanRepository.save(updatedPlan);
        }
        return null;
    }

    public boolean deleteLearningPlan(String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
