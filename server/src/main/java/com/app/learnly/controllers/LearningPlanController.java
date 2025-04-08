package com.app.learnly.controllers;

import com.app.learnly.models.LearningPlan;
import com.app.learnly.models.User;
import com.app.learnly.repositories.UserRepository;
import com.app.learnly.services.LearningPlanService;
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
    @PostMapping()
    public ResponseEntity<LearningPlan> createLearningPlan(
            @RequestBody LearningPlan learningPlan,
            @AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub");

        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        learningPlan.setUserId(user.getId()); // Set MongoDB ObjectId
        learningPlan.setCreatedAt(new Date());
        learningPlan.setUpdatedAt(new Date());
        if (learningPlan.getFollowers() == null) {
            learningPlan.setFollowers(new ArrayList<>()); // Initialize followers if null
        }
        // isPublic defaults to false in the model, so no need to set it explicitly unless provided

        LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
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
        String providerId = principal.getAttribute("sub");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
        // Check visibility: allow access if public or owned by the user
        if (!plan.isPublic() && !plan.getUserId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(plan, HttpStatus.OK);
    }

    // Get learning plans for the current user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlan>> getLearningPlansByUserId(
            @PathVariable String userId,
            @AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub");
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
        String providerId = principal.getAttribute("sub");
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
        importedPlan.setUserId(user.getId());
        importedPlan.setTitle(originalPlan.getTitle());
        importedPlan.setDescription(originalPlan.getDescription());
        importedPlan.setTopics(originalPlan.getTopics()); // Copy topics
        importedPlan.setCreatedAt(new Date());
        importedPlan.setUpdatedAt(new Date());
        importedPlan.setPublic(false); // Imported plans default to private
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
        String providerId = principal.getAttribute("sub");
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
        if (!existingPlan.getUserId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only owner can update
        }

        learningPlan.setUserId(user.getId()); // Ensure userId remains consistent
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
        String providerId = principal.getAttribute("sub");
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
        if (!plan.getUserId().equals(user.getId())) {
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