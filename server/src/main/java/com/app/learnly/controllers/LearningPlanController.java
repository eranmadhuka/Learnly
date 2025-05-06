package com.app.learnly.controllers;

import com.app.learnly.dto.LearningPlanDTO;
import com.app.learnly.model.LearningPlan;
import com.app.learnly.model.User;
import com.app.learnly.repository.UserRepository;
import com.app.learnly.service.LearningPlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(LearningPlanController.class);

    @Autowired
    private LearningPlanService learningPlanService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createLearningPlan(
            @RequestBody LearningPlanDTO learningPlanDTO,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = validateUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            LearningPlan learningPlan = learningPlanDTO.toEntity();
            learningPlan.setUser(user);
            learningPlan.setCreatedAt(new Date());
            learningPlan.setUpdatedAt(new Date());
            if (learningPlan.getFollowers() == null) {
                learningPlan.setFollowers(new ArrayList<>());
            }

            LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
            logger.info("Created learning plan with ID: {} for user: {}", createdPlan.getId(), user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(LearningPlanDTO.fromEntity(createdPlan));
        } catch (Exception e) {
            logger.error("Error creating learning plan: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLearningPlanById(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = validateUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Optional<LearningPlan> planOptional = learningPlanService.getLearningPlanById(id);
            if (!planOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            LearningPlan plan = planOptional.get();
            if (!plan.isPublic() && !plan.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(LearningPlanDTO.fromEntity(plan));
        } catch (Exception e) {
            logger.error("Error retrieving learning plan: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLearningPlansByUserId(
            @PathVariable String userId,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = validateUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!user.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<LearningPlan> plans = learningPlanService.getLearningPlansByUserId(userId);
            List<LearningPlanDTO> planDTOs = plans.stream()
                    .map(LearningPlanDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(planDTOs);
        } catch (Exception e) {
            logger.error("Error retrieving user plans: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/public")
    public ResponseEntity<List<LearningPlanDTO>> getPublicPlans() {
        try {
            List<LearningPlan> allPlans = learningPlanService.getAllLearningPlans();
            List<LearningPlanDTO> publicPlanDTOs = allPlans.stream()
                    .filter(LearningPlan::isPublic)
                    .map(LearningPlanDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(publicPlanDTOs);
        } catch (Exception e) {
            logger.error("Error retrieving public plans: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/import/{planId}")
    public ResponseEntity<?> importLearningPlan(
            @PathVariable String planId,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = validateUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Optional<LearningPlan> originalPlanOptional = learningPlanService.getLearningPlanById(planId);
            if (!originalPlanOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            LearningPlan originalPlan = originalPlanOptional.get();
            if (!originalPlan.isPublic()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            LearningPlan importedPlan = new LearningPlan();
            importedPlan.setUser(user);
            importedPlan.setTitle(originalPlan.getTitle());
            importedPlan.setDescription(originalPlan.getDescription());

            List<LearningPlan.Topic> resetTopics = originalPlan.getTopics().stream()
                    .map(topic -> {
                        LearningPlan.Topic newTopic = new LearningPlan.Topic();
                        newTopic.setTitle(topic.getTitle());
                        newTopic.setDescription(topic.getDescription());
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
                        newTopic.setCompleted(false);
                        return newTopic;
                    })
                    .collect(Collectors.toList());

            importedPlan.setTopics(resetTopics);
            importedPlan.setCreatedAt(new Date());
            importedPlan.setUpdatedAt(new Date());
            importedPlan.setIsPublic(false);
            importedPlan.setFollowers(new ArrayList<>());

            LearningPlan savedPlan = learningPlanService.createLearningPlan(importedPlan);

            originalPlan.getFollowers().add(user.getId());
            learningPlanService.updateLearningPlan(originalPlan.getId(), originalPlan);

            logger.info("Imported learning plan: {} for user: {}", savedPlan.getId(), user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(LearningPlanDTO.fromEntity(savedPlan));
        } catch (Exception e) {
            logger.error("Error importing learning plan: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlanDTO learningPlanDTO,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = validateUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Optional<LearningPlan> existingPlanOptional = learningPlanService.getLearningPlanById(id);
            if (!existingPlanOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            LearningPlan existingPlan = existingPlanOptional.get();
            if (!existingPlan.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            LearningPlan learningPlan = learningPlanDTO.toEntity();
            learningPlan.setUser(user);
            learningPlan.setUpdatedAt(new Date());
            LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, learningPlan);

            if (updatedPlan != null) {
                return ResponseEntity.ok(LearningPlanDTO.fromEntity(updatedPlan));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error updating learning plan: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLearningPlan(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = validateUser(principal);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Optional<LearningPlan> planOptional = learningPlanService.getLearningPlanById(id);
            if (!planOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            LearningPlan plan = planOptional.get();
            if (!plan.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            boolean deleted = learningPlanService.deleteLearningPlan(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting learning plan: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Helper method to validate the user from OAuth2 principal
     * @param principal OAuth2User principal
     * @return User object if valid, null otherwise
     */
    private User validateUser(OAuth2User principal) {
        if (principal == null || principal.getAttribute("email") == null) {
            logger.warn("Unauthorized access attempt: No authenticated user");
            return null;
        }

        String email = principal.getAttribute("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (!userOptional.isPresent()) {
            logger.warn("User not found for email: {}", email);
            return null;
        }

        return userOptional.get();
    }
}