package com.app.learnly.services;

import com.app.learnly.models.Post;
import com.app.learnly.models.User;
import com.app.learnly.repositories.PostRepository;
import com.app.learnly.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling post-related business logic in Learnly.
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;



    // --- Core Post Operations ---

    public Optional<Post> findById(String postId) {
        return postRepository.findById(postId);
    }

    public Post createPost(Post post, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        post.setUser(user);
        post.setCreatedAt(new Date());
        return postRepository.save(post);
    }

    public Post updatePost(String postId, Post postUpdates) {
        return postRepository.findById(postId)
                .map(existingPost -> {
                    existingPost.setTitle(postUpdates.getTitle());
                    existingPost.setContent(postUpdates.getContent());
                    existingPost.setMediaUrls(postUpdates.getMediaUrls());
                    existingPost.setFileTypes(postUpdates.getFileTypes());
                    existingPost.setTags(postUpdates.getTags());
                    return postRepository.save(existingPost);
                })
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
    }

    public void deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
        postRepository.delete(post);
    }

    // --- Fetch Posts ---

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> getFeedPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public List<Post> getFollowingPosts(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<String> followingUserIds = user.getFollowing();
        if (followingUserIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<User> followingUsers = userRepository.findByIdIn(followingUserIds);
        return postRepository.findByUserIn(followingUsers);
    }


}
