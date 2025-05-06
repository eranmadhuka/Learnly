package com.app.learnly.services;

import com.app.learnly.models.User;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }

    public List<User> findAllExceptEmail(String email) {
        return userRepository.findByEmailNot(email);
    }

    public User updateUserProfile(String email, User updatedUser) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getBio() != null) {
            user.setBio(updatedUser.getBio());
        }
        if (updatedUser.getPicture() != null) {
            user.setPicture(updatedUser.getPicture());
        }
        return userRepository.save(user);
    }

    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public User followUser(String email, String userId) {
        User follower = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
        if (!follower.getFollowing().contains(userId)) {
            follower.getFollowing().add(userId);
            following.getFollowers().add(follower.getId());
            userRepository.save(follower);
            userRepository.save(following);
        }
        return follower;
    }

    public User unfollowUser(String email, String userId) {
        User follower = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));
        if (follower.getFollowing().contains(userId)) {
            follower.getFollowing().remove(userId);
            following.getFollowers().remove(follower.getId());
            userRepository.save(follower);
            userRepository.save(following);
        }
        return follower;
    }

    public List<User> getUserFollowers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userRepository.findAllById(user.getFollowers());
    }

    public List<User> getUserFollowing(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userRepository.findAllById(user.getFollowing());
    }

    public User savePost(String email, String postId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getSavedPosts().contains(postId)) {
            user.getSavedPosts().add(postId);
            userRepository.save(user);
        }
        return user;
    }

    public User unsavePost(String email, String postId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getSavedPosts().contains(postId)) {
            user.getSavedPosts().remove(postId);
            userRepository.save(user);
        }
        return user;
    }

    public List<String> getSavedPosts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getSavedPosts();
    }
}