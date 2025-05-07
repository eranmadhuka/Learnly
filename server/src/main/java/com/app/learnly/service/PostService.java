package com.app.learnly.service;

import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import com.app.learnly.repository.PostRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            post.setUser(userOptional.get());
            post.setCreatedAt(new Date());
            return postRepository.save(post);
        }
        throw new RuntimeException("User not found");
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(String id) {
        return postRepository.findById(id).orElse(null);
    }

    public List<Post> getPostsByUser(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            return postRepository.findByUser(userOptional.get());
        }
        return List.of();
    }

    public List<Post> getPostsByTag(String tag) {
        return postRepository.findByTagsContaining(tag);
    }

    public Post updatePost(String id, Post post) {
        Optional<Post> existingPostOptional = postRepository.findById(id);
        if (existingPostOptional.isPresent()) {
            Post existingPost = existingPostOptional.get();
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setMediaUrls(post.getMediaUrls());
            existingPost.setFileTypes(post.getFileTypes());
            existingPost.setTags(post.getTags());
            return postRepository.save(existingPost);
        }
        return null;
    }

    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Post> getPostsByUserIds(List<String> userIds) {
        List<User> users = userRepository.findByIdIn(userIds);
        return postRepository.findByUserIn(users);
    }

    public List<Post> getSavedPosts(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            return postRepository.findByIdIn(userOptional.get().getSavedPosts());
        }
        return List.of();
    }
}