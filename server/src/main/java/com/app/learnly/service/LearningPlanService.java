package com.app.learnly.service;

import com.app.learnly.model.LearningPlan;
import com.app.learnly.model.User;
import com.app.learnly.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        // Initialize timestamps and empty collections
        learningPlan.setCreatedAt(new Date());
        learningPlan.setUpdatedAt(new Date());

        if (learningPlan.getTopics() == null) {
            learningPlan.setTopics(List.of());
        }
        if (learningPlan.getFollowers() == null) {
            learningPlan.setFollowers(List.of());
        }

        return learningPlanRepository.save(learningPlan);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public List<LearningPlan> getLearningPlansByUserId(String userId) {
        // Assuming you have a way to get User by ID
        User user = new User();
        user.setId(userId);
        return learningPlanRepository.findByUser(user);
    }

    public List<LearningPlan> getPublicLearningPlans() {
        return learningPlanRepository.findByIsPublic(true);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlanUpdates) {
        return learningPlanRepository.findById(id)
                .map(existingPlan -> {
                    // Update only non-null fields
                    if (learningPlanUpdates.getTitle() != null) {
                        existingPlan.setTitle(learningPlanUpdates.getTitle());
                    }
                    if (learningPlanUpdates.getDescription() != null) {
                        existingPlan.setDescription(learningPlanUpdates.getDescription());
                    }
                    if (learningPlanUpdates.getTopics() != null) {
                        existingPlan.setTopics(learningPlanUpdates.getTopics());
                    }
                    existingPlan.setIsPublic(learningPlanUpdates.isPublic());
                    existingPlan.setUpdatedAt(new Date());

                    return learningPlanRepository.save(existingPlan);
                })
                .orElse(null);
    }

    public boolean deleteLearningPlan(String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public LearningPlan importLearningPlan(String originalPlanId, User importingUser) {
        return learningPlanRepository.findById(originalPlanId)
                .map(originalPlan -> {
                    if (!originalPlan.isPublic()) {
                        throw new IllegalArgumentException("Cannot import a private learning plan");
                    }

                    LearningPlan importedPlan = new LearningPlan();
                    importedPlan.setUser(importingUser);
                    importedPlan.setTitle(originalPlan.getTitle() + " (Imported)");
                    importedPlan.setDescription(originalPlan.getDescription());
                    importedPlan.setIsPublic(false);

                    // Copy topics with completion reset
                    List<LearningPlan.Topic> importedTopics = originalPlan.getTopics().stream()
                            .map(originalTopic -> {
                                LearningPlan.Topic newTopic = new LearningPlan.Topic();
                                newTopic.setTitle(originalTopic.getTitle());
                                newTopic.setDescription(originalTopic.getDescription());
                                newTopic.setCompleted(false);
                                newTopic.setResources(originalTopic.getResources());
                                return newTopic;
                            })
                            .collect(Collectors.toList());

                    importedPlan.setTopics(importedTopics);

                    // Add to followers of original plan
                    originalPlan.getFollowers().add(importingUser.getId());
                    learningPlanRepository.save(originalPlan);

                    return createLearningPlan(importedPlan);
                })
                .orElseThrow(() -> new IllegalArgumentException("Original learning plan not found"));
    }

    public LearningPlan addFollower(String planId, String userId) {
        return learningPlanRepository.findById(planId)
                .map(plan -> {
                    if (!plan.getFollowers().contains(userId)) {
                        plan.getFollowers().add(userId);
                        plan.setUpdatedAt(new Date());
                        return learningPlanRepository.save(plan);
                    }
                    return plan;
                })
                .orElseThrow(() -> new IllegalArgumentException("Learning plan not found"));
    }

    public LearningPlan removeFollower(String planId, String userId) {
        return learningPlanRepository.findById(planId)
                .map(plan -> {
                    plan.getFollowers().remove(userId);
                    plan.setUpdatedAt(new Date());
                    return learningPlanRepository.save(plan);
                })
                .orElseThrow(() -> new IllegalArgumentException("Learning plan not found"));
    }
}