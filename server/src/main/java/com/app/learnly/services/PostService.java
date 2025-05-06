package com.app.learnly.services;

import com.app.learnly.models.Post;
import com.app.learnly.models.User;
import com.app.learnly.repository.PostRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Post createPost(Post post, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        post.setCreatedAt(new Date());
        if (post.getMediaUrls() == null) {
            post.setMediaUrls(new ArrayList<>());
        }
        if (post.getFileTypes() == null) {
            post.setFileTypes(new ArrayList<>());
        }
        if (post.getTags() == null) {
            post.setTags(new ArrayList<>());
        }
        return postRepository.save(post);
    }

    public Optional<Post> findById(String postId) {
        return postRepository.findById(postId);
    }

    public Post updatePost(String postId, Post postUpdates) {
        Optional<Post> existingPostOptional = postRepository.findById(postId);
        if (existingPostOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        Post existingPost = existingPostOptional.get();
        if (postUpdates.getTitle() != null) {
            existingPost.setTitle(postUpdates.getTitle());
        }
        if (postUpdates.getContent() != null) {
            existingPost.setContent(postUpdates.getContent());
        }
        if (postUpdates.getMediaUrls() != null) {
            existingPost.setMediaUrls(postUpdates.getMediaUrls());
        }
        if (postUpdates.getFileTypes() != null) {
            existingPost.setFileTypes(postUpdates.getFileTypes());
        }
        if (postUpdates.getTags() != null) {
            existingPost.setTags(postUpdates.getTags());
        }
        return postRepository.save(existingPost);
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> getFeedPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public void deletePost(String postId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        postRepository.deleteById(postId);
    }
}