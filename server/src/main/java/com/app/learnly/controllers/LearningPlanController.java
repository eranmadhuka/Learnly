package com.app.learnly.controllers;

import com.app.learnly.dto.LearningPlanDTO;
import com.app.learnly.models.LearningPlan;
import com.app.learnly.models.User;
import com.app.learnly.repository.UserRepository;
import com.app.learnly.services.LearningPlanService;
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
    public ResponseEntity<LearningPlanDTO> createLearningPlan(
            @RequestBody LearningPlanDTO learningPlanDTO,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                logger.warn("Unauthorized access attempt: No authenticated user");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", email);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            LearningPlan learningPlan = learningPlanDTO.toEntity();
            learningPlan.setUser(user);
            learningPlan.setCreatedAt(new Date());
            learningPlan.setUpdatedAt(new Date());
            if (learningPlan.getFollowers() == null) {
                learningPlan.setFollowers(new ArrayList<>());
            }

            LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
            logger.info("Created learning plan with ID: {} for user: {}", createdPlan.getId(), user.getEmail());
            return new ResponseEntity<>(LearningPlanDTO.fromEntity(createdPlan), HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating learning plan: {}", e.getMessage(), e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanDTO> getLearningPlanById(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                logger.warn("Unauthorized access attempt: No authenticated user");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", email);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            Optional<LearningPlan> planOptional = learningPlanService.getLearningPlanById(id);
            if (!planOptional.isPresent()) {
                logger.warn("Learning plan not found: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            LearningPlan plan = planOptional.get();
            if (!plan.isPublic() && !plan.getUser().getId().equals(user.getId())) {
                logger.warn("Access denied for plan: {} by user: {}", id, user.getEmail());
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            return new ResponseEntity<>(LearningPlanDTO.fromEntity(plan), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving learning plan: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlanDTO>> getLearningPlansByUserId(
            @PathVariable String userId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                logger.warn("Unauthorized access attempt: No authenticated user");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", email);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            if (!user.getId().equals(userId)) {
                logger.warn("Access denied for user plans: {} by user: {}", userId, user.getEmail());
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            List<LearningPlan> plans = learningPlanService.getLearningPlansByUserId(userId);
            List<LearningPlanDTO> planDTOs = plans.stream()
                    .map(LearningPlanDTO::fromEntity)
                    .collect(Collectors.toList());
            logger.info("Retrieved {} learning plans for user: {}", planDTOs.size(), user.getEmail());
            return new ResponseEntity<>(planDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving user plans: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
            logger.info("Retrieved {} public learning plans", publicPlanDTOs.size());
            return new ResponseEntity<>(publicPlanDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving public plans: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/import/{planId}")
    public ResponseEntity<LearningPlanDTO> importLearningPlan(
            @PathVariable String planId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                logger.warn("Unauthorized access attempt: No authenticated user");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", email);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            Optional<LearningPlan> originalPlanOptional = learningPlanService.getLearningPlanById(planId);
            if (!originalPlanOptional.isPresent()) {
                logger.warn("Learning plan not found for import: {}", planId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            LearningPlan originalPlan = originalPlanOptional.get();
            if (!originalPlan.isPublic()) {
                logger.warn("Import denied for non-public plan: {} by user: {}", planId, user.getEmail());
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
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
            return new ResponseEntity<>(LearningPlanDTO.fromEntity(savedPlan), HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error importing learning plan: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanDTO> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlanDTO learningPlanDTO,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                logger.warn("Unauthorized access attempt: No authenticated user");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", email);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            Optional<LearningPlan> existingPlanOptional = learningPlanService.getLearningPlanById(id);
            if (!existingPlanOptional.isPresent()) {
                logger.warn("Learning plan not found for update: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            LearningPlan existingPlan = existingPlanOptional.get();
            if (!existingPlan.getUser().getId().equals(user.getId())) {
                logger.warn("Update denied for plan: {} by user: {}", id, user.getEmail());
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            LearningPlan learningPlan = learningPlanDTO.toEntity();
            learningPlan.setUser(user);
            learningPlan.setUpdatedAt(new Date());
            LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, learningPlan);

            if (updatedPlan != null) {
                logger.info("Updated learning plan: {} for user: {}", id, user.getEmail());
                return new ResponseEntity<>(LearningPlanDTO.fromEntity(updatedPlan), HttpStatus.OK);
            } else {
                logger.warn("Failed to update learning plan: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error updating learning plan: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                logger.warn("Unauthorized access attempt: No authenticated user");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", email);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            Optional<LearningPlan> planOptional = learningPlanService.getLearningPlanById(id);
            if (!planOptional.isPresent()) {
                logger.warn("Learning plan not found for deletion: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            LearningPlan plan = planOptional.get();
            if (!plan.getUser().getId().equals(user.getId())) {
                logger.warn("Deletion denied for plan: {} by user: {}", id, user.getEmail());
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            boolean deleted = learningPlanService.deleteLearningPlan(id);
            if (deleted) {
                logger.info("Deleted learning plan: {} for user: {}", id, user.getEmail());
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                logger.warn("Failed to delete learning plan: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error deleting learning plan: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}