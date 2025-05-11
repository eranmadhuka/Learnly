package com.app.learnly.service;

import com.app.learnly.model.User;
import com.app.learnly.repository.PostRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    /**
     * Retrieves the current user based on their provider ID.
     *
     * @param providerId The unique ID from the OAuth2 provider.
     * @return The User object if found, otherwise null.
     */
    public User getCurrentUser(String providerId) {
        if (providerId == null) {
            return null;
        }
        return userRepository.findByProviderId(providerId).orElse(null);
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param userId The ID of the user.
     * @return The User object if found, otherwise null.
     */
//    public User getUserById(String userId) {
//        return userRepository.findById(userId).orElse(null);
//    }

    /**
     * Searches for users excluding the current user, with optional filtering by name and email.
     *
     * @param currentUserProviderId The provider ID of the current user.
     * @param name Optional name filter.
     * @param email Optional email filter.
     * @return A list of matching users.
     */
    public List<User> searchUsers(String currentUserProviderId, String name, String email) {
        if (currentUserProviderId == null) {
            return List.of();
        }

        List<User> users = userRepository.findByProviderIdNot(currentUserProviderId);

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

        return users;
    }

    /**
     * Updates the profile of a user based on provided updates.
     *
     * @param providerId The provider ID of the user.
     * @param updates A map containing fields to update (name, bio, picture).
     * @return The updated User object, or null if the user is not found.
     */
    public User updateProfile(String providerId, Map<String, String> updates) {
        if (providerId == null) {
            return null;
        }

        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        if (updates.containsKey("name") && updates.get("name") != null && !updates.get("name").trim().isEmpty()) {
            user.setName(updates.get("name").trim());
        }
        if (updates.containsKey("bio")) {
            user.setBio(updates.get("bio"));
        }
        if (updates.containsKey("picture")) {
            user.setPicture(updates.get("picture"));
        }

        return userRepository.save(user);
    }

    /**
     * Deletes a user account.
     *
     * @param providerId The provider ID of the user.
     * @return True if the account was deleted, false if the user was not found.
     */
    public boolean deleteAccount(String providerId) {
        if (providerId == null) {
            return false;
        }

        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
        if (optionalUser.isEmpty()) {
            return false;
        }

        userRepository.delete(optionalUser.get());
        return true;
    }

    /**
     * Follows a target user.
     *
     * @param currentUserProviderId The provider ID of the current user.
     * @param targetUserId The ID of the user to follow.
     * @return The updated current User object, or null if the operation fails.
     */
    public User followUser(String currentUserProviderId, String targetUserId) {
        if (currentUserProviderId == null || targetUserId == null) {
            return null;
        }

        Optional<User> currentUserOpt = userRepository.findByProviderId(currentUserProviderId);
        Optional<User> targetUserOpt = userRepository.findById(targetUserId);

        if (currentUserOpt.isEmpty() || targetUserOpt.isEmpty() || currentUserOpt.get().getId().equals(targetUserId)) {
            return null;
        }

        User currentUser = currentUserOpt.get();
        User targetUser = targetUserOpt.get();

        if (!currentUser.getFollowing().contains(targetUserId)) {
            currentUser.getFollowing().add(targetUserId);
            targetUser.getFollowers().add(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }

        return currentUser;
    }

    /**
     * Unfollows a target user.
     *
     * @param currentUserProviderId The provider ID of the current user.
     * @param targetUserId The ID of the user to unfollow.
     * @return The updated current User object, or null if the operation fails.
     */
    public User unfollowUser(String currentUserProviderId, String targetUserId) {
        if (currentUserProviderId == null || targetUserId == null) {
            return null;
        }

        Optional<User> currentUserOpt = userRepository.findByProviderId(currentUserProviderId);
        Optional<User> targetUserOpt = userRepository.findById(targetUserId);

        if (currentUserOpt.isEmpty() || targetUserOpt.isEmpty()) {
            return null;
        }

        User currentUser = currentUserOpt.get();
        User targetUser = targetUserOpt.get();

        currentUser.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(currentUser.getId());
        userRepository.save(currentUser);
        userRepository.save(targetUser);

        return currentUser;
    }

    /**
     * Retrieves the followers of a user.
     *
     * @param userId The ID of the user.
     * @return A list of followers, or an empty list if the user is not found.
     */
    public List<User> getUserFollowers(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return List.of();
        }

        User user = optionalUser.get();
        return userRepository.findAllById(user.getFollowers());
    }

    /**
     * Retrieves the users a specified user is following.
     *
     * @param userId The ID of the user.
     * @return A list of followed users, or an empty list if the user is not found.
     */
    public List<User> getUserFollowing(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return List.of();
        }

        User user = optionalUser.get();
        return userRepository.findAllById(user.getFollowing());
    }

    /**
     * Saves a post for the current user.
     *
     * @param providerId The provider ID of the current user.
     * @param postId The ID of the post to save.
     * @return The updated User object, or null if the user is not found.
     */
//    public User savePost(String providerId, String postId) {
//        if (providerId == null || postId == null) {
//            return null;
//        }
//
//        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
//        if (optionalUser.isEmpty()) {
//            return null;
//        }
//
//        User user = optionalUser.get();
//        if (!user.getSavedPosts().contains(postId)) {
//            user.getSavedPosts().add(postId);
//            userRepository.save(user);
//        }
//
//        return user;
//    }
//
//    /**
//     * Removes a saved post for the current user.
//     *
//     * @param providerId The provider ID of the current user.
//     * @param postId The ID of the post to unsave.
//     * @return The updated User object, or null if the user is not found.
//     */
//    public User unsavePost(String providerId, String postId) {
//        if (providerId == null || postId == null) {
//            return null;
//        }
//
//        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
//        if (optionalUser.isEmpty()) {
//            return null;
//        }
//
//        User user = optionalUser.get();
//        user.getSavedPosts().remove(postId);
//        userRepository.save(user);
//
//        return user;
//    }

    /**
     * Retrieves the saved posts of the current user.
     *
     * @param providerId The provider ID of the current user.
     * @return A list of saved post IDs, or an empty list if the user is not found.
     */
    public List<String> getSavedPosts(String providerId) {
        if (providerId == null) {
            return List.of();
        }

        Optional<User> optionalUser = userRepository.findByProviderId(providerId);
        return optionalUser.map(User::getSavedPosts).orElse(List.of());
    }

    public void savePost(String userId, String postId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent() && postRepository.existsById(postId)) {
            User user = userOptional.get();
            if (!user.getSavedPosts().contains(postId)) {
                user.getSavedPosts().add(postId);
                userRepository.save(user);
            }
        }
    }

    public void unsavePost(String userId, String postId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getSavedPosts().remove(postId);
            userRepository.save(user);
        }
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }
}