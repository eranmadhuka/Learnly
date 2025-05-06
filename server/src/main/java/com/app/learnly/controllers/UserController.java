package com.app.learnly.controllers;

import com.app.learnly.models.User;
import com.app.learnly.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private UserService userService;

    // Helper method to get the current user's email
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // For JWT authentication, the principal is the email
            if (authentication.getPrincipal() instanceof String) {
                return (String) authentication.getPrincipal();
            }

            // For OAuth2 authentication, try to get from OAuth2User
            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                return oauth2User.getAttribute("email");
            }

            // Fallback to getName() which should be the email in our setup
            return authentication.getName();
        }
        return null;
    }

    // Get current user - works with both JWT and OAuth2
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userService.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get a specific user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        Optional<User> user = userService.findById(userId);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search users
    @GetMapping
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email
    ) {
        String currentUserEmail = getCurrentUserEmail();

        if (currentUserEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<User> users = userService.findAllExceptEmail(currentUserEmail);

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
    public ResponseEntity<User> updateProfile(@RequestBody Map<String, String> updates) {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User updatedUser = new User();
        if (updates.containsKey("name")) {
            updatedUser.setName(updates.get("name"));
        }
        if (updates.containsKey("bio")) {
            updatedUser.setBio(updates.get("bio"));
        }
        if (updates.containsKey("picture")) {
            updatedUser.setPicture(updates.get("picture"));
        }
        User user = userService.updateUserProfile(email, updatedUser);
        return ResponseEntity.ok(user);
    }

    // Delete user account
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount() {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userService.deleteUserByEmail(email);
        return ResponseEntity.noContent().build();
    }

    // Follow a user
    @PostMapping("/follow/{userId}")
    public ResponseEntity<User> followUser(@PathVariable String userId) {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userService.followUser(email, userId);
        return ResponseEntity.ok(currentUser);
    }

    // Unfollow a user
    @DeleteMapping("/unfollow/{userId}")
    public ResponseEntity<User> unfollowUser(@PathVariable String userId) {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userService.unfollowUser(email, userId);
        return ResponseEntity.ok(currentUser);
    }

    // Get user's followers
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getUserFollowers(@PathVariable String userId) {
        List<User> followers = userService.getUserFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    // Get user's following
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getUserFollowing(@PathVariable String userId) {
        List<User> following = userService.getUserFollowing(userId);
        return ResponseEntity.ok(following);
    }

    // Save a post
    @PostMapping("/saved-posts/{postId}")
    public ResponseEntity<User> savePost(@PathVariable String postId) {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userService.savePost(email, postId);
        return ResponseEntity.ok(currentUser);
    }

    // Unsave a post
    @DeleteMapping("/saved-posts/{postId}")
    public ResponseEntity<User> unsavePost(@PathVariable String postId) {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = userService.unsavePost(email, postId);
        return ResponseEntity.ok(currentUser);
    }

    // Get user's saved posts
    @GetMapping("/me/saved-posts")
    public ResponseEntity<List<String>> getSavedPosts() {
        String email = getCurrentUserEmail();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<String> savedPosts = userService.getSavedPosts(email);
        return ResponseEntity.ok(savedPosts);
    }
}