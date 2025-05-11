package com.app.learnly.controller;

import com.app.learnly.model.LearningPlan;
import com.app.learnly.model.User;
import com.app.learnly.repository.UserRepository;
import com.app.learnly.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @Autowired
    private UserRepository userRepository;

    // Create a new learning plan with visibility
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(
            @RequestBody LearningPlan learningPlan,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null
                    ? principal.getAttribute("sub")
                    : principal.getAttribute("id");

            Optional<User> userOptional = userRepository.findByProviderId(providerId);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            User user = userOptional.get();
            learningPlan.setUser(user); // Set the User object
            learningPlan.setCreatedAt(new Date());
            learningPlan.setUpdatedAt(new Date());
            if (learningPlan.getFollowers() == null) {
                learningPlan.setFollowers(new ArrayList<>());
            }

            LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
            return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a specific learning plan by ID (only if public or owned by user)
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        Optional<LearningPlan> planOptional = learningPlanService.getLearningPlanById(id);
        if (!planOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        LearningPlan plan = planOptional.get();
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        // Check visibility: allow access if public or owned by the user
        if (!plan.isPublic() && !plan.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(plan, HttpStatus.OK);
    }

    // Get learning plans for the current user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlan>> getLearningPlansByUserId(
            @PathVariable String userId,
            @AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        // Ensure only the owner can fetch their plans
        if (!user.getId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<LearningPlan> plans = learningPlanService.getLearningPlansByUserId(userId);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }


    // Get all public learning plans
    @GetMapping("/public")
    public ResponseEntity<List<LearningPlan>> getPublicPlans() {
        List<LearningPlan> allPlans = learningPlanService.getAllLearningPlans();
        List<LearningPlan> publicPlans = allPlans.stream()
                .filter(LearningPlan::isPublic)
                .collect(Collectors.toList());
        return new ResponseEntity<>(publicPlans, HttpStatus.OK);
    }

    // Import a public learning plan to the user's dashboard
    @PostMapping("/import/{planId}")
    public ResponseEntity<LearningPlan> importLearningPlan(
            @PathVariable String planId,
            @AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        Optional<LearningPlan> originalPlanOptional = learningPlanService.getLearningPlanById(planId);
        if (!originalPlanOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        LearningPlan originalPlan = originalPlanOptional.get();
        if (!originalPlan.isPublic()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only public plans can be imported
        }

        // Create a new plan for the user based on the public plan
        LearningPlan importedPlan = new LearningPlan();
        importedPlan.setUser(user); // Set the User object
        importedPlan.setTitle(originalPlan.getTitle());
        importedPlan.setDescription(originalPlan.getDescription());

        // Create a deep copy of topics with completed set to false
        List<LearningPlan.Topic> resetTopics = originalPlan.getTopics().stream()
                .map(topic -> {
                    LearningPlan.Topic newTopic = new LearningPlan.Topic();
                    newTopic.setTitle(topic.getTitle());
                    newTopic.setDescription(topic.getDescription());
                    // Create a deep copy of resources
                    List<LearningPlan.Resource> newResources = topic.getResources().stream()
                            .map(resource -> {
                                LearningPlan.Resource newResource = new LearningPlan.Resource();
                                newResource.setTitle(resource.getTitle());
                                newResource.setUrl(resource.getUrl());
                                newResource.setType(resource.getType());
                                return newResource;
                            })
                            .collect(Collectors.toList());
                    newTopic.setResources(newResources);
                    newTopic.setCompleted(false); // Explicitly set completed to false
                    return newTopic;
                })
                .collect(Collectors.toList());

        importedPlan.setTopics(resetTopics);
        importedPlan.setCreatedAt(new Date());
        importedPlan.setUpdatedAt(new Date());
        importedPlan.setIsPublic(false); // Imported plans default to private
        importedPlan.setFollowers(new ArrayList<>()); // No followers initially

        LearningPlan savedPlan = learningPlanService.createLearningPlan(importedPlan);

        // Add the user to the original plan's followers
        originalPlan.getFollowers().add(user.getId());
        learningPlanService.updateLearningPlan(originalPlan.getId(), originalPlan);

        return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
    }

    // Update an existing learning plan
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlan learningPlan,
            @AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        Optional<LearningPlan> existingPlanOptional = learningPlanService.getLearningPlanById(id);
        if (!existingPlanOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        LearningPlan existingPlan = existingPlanOptional.get();
        if (!existingPlan.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only owner can update
        }

        learningPlan.setUser(user); // Ensure user remains consistent
        learningPlan.setUpdatedAt(new Date());
        LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, learningPlan);

        if (updatedPlan != null) {
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a learning plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        Optional<LearningPlan> planOptional = learningPlanService.getLearningPlanById(id);
        if (!planOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        LearningPlan plan = planOptional.get();
        if (!plan.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only owner can delete
        }

        boolean deleted = learningPlanService.deleteLearningPlan(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}