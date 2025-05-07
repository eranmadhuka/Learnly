package com.app.learnly.controllers;

import com.app.learnly.model.User;
import com.app.learnly.repository.UserRepository;
import com.app.learnly.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    // Get current user
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userRepository.findByProviderId(providerId);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get a specific user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search users
    @GetMapping
    public ResponseEntity<List<User>> searchUsers(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email
    ) {
        String currentUserProviderId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");

        if (currentUserProviderId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Get all users except the current user
        List<User> users = userRepository.findByProviderIdNot(currentUserProviderId);

        // Apply optional filtering by name and email
        if (name != null) {
            users = users.stream()
                    .filter(user -> user.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (email != null) {
            users = users.stream()
                    .filter(user -> user.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(users);
    }

    // Update user profile
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, String> updates
    ) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        // Update fields that are included in the request
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("bio")) {
            user.setBio(updates.get("bio"));
        }
        if (updates.containsKey("picture")) {
            user.setPicture(updates.get("picture"));
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete user account
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(optionalUser.get());
        return ResponseEntity.noContent().build();
    }

    // Follow a user
    @PostMapping("/follow/{userId}")
    public ResponseEntity<User> followUser(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable String userId
    ) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            System.out.println("No providerId found in principal");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println("Attempting to follow user: " + userId + " by providerId: " + providerId);
        User currentUser = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Optional<User> optionalTargetUser = userRepository.findById(userId);
        if (optionalTargetUser.isEmpty()) {
            System.out.println("Target user not found: " + userId);
            return ResponseEntity.notFound().build();
        }

        User targetUser = optionalTargetUser.get();

        if (!currentUser.getFollowing().contains(userId)) {
            currentUser.getFollowing().add(userId);
            userRepository.save(currentUser);
            targetUser.getFollowers().add(currentUser.getId());
            userRepository.save(targetUser);
            System.out.println("Successfully followed user: " + userId);
        } else {
            System.out.println("Already following user: " + userId);
        }

        return ResponseEntity.ok(currentUser);
    }

    // Unfollow a user
    @DeleteMapping("/unfollow/{userId}")
    public ResponseEntity<User> unfollowUser(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable String userId
    ) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Optional<User> optionalTargetUser = userRepository.findById(userId);
        if (optionalTargetUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User targetUser = optionalTargetUser.get();

        // Remove from following list
        currentUser.getFollowing().remove(userId);
        userRepository.save(currentUser);

        // Remove from target user's followers list
        targetUser.getFollowers().remove(currentUser.getId());
        userRepository.save(targetUser);

        return ResponseEntity.ok(currentUser);
    }

    // Get user's followers
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getUserFollowers(@PathVariable String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        List<User> followers = userRepository.findAllById(user.getFollowers());

        return ResponseEntity.ok(followers);
    }

    // Get user's following
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getUserFollowing(@PathVariable String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        List<User> following = userRepository.findAllById(user.getFollowing());

        return ResponseEntity.ok(following);
    }

    // Save a post
    @PostMapping("/saved-posts/{postId}")
    public ResponseEntity<User> savePost(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable String postId
    ) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // Check if post is already saved
        if (!currentUser.getSavedPosts().contains(postId)) {
            currentUser.getSavedPosts().add(postId);
            userRepository.save(currentUser);
        }

        return ResponseEntity.ok(currentUser);
    }

    // Unsave a post
    @DeleteMapping("/saved-posts/{postId}")
    public ResponseEntity<User> unsavePost(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable String postId
    ) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        currentUser.getSavedPosts().remove(postId);
        userRepository.save(currentUser);

        return ResponseEntity.ok(currentUser);
    }

    // Get user's saved posts
    @GetMapping("/me/saved-posts")
    public ResponseEntity<List<String>> getSavedPosts(@AuthenticationPrincipal OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        if (providerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        return ResponseEntity.ok(currentUser.getSavedPosts());
    }
}