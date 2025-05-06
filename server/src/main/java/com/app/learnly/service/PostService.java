package com.app.learnly.service;

import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import com.app.learnly.repository.PostRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public Post createPost(Post post) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        post.setCreatedAt(new Date());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUserId(String userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return postRepository.findByUser(user.get());
        }
        throw new RuntimeException("User not found");
    }

    public List<Post> getPostsByTag(String tag) {
        return postRepository.findByTagsContaining(tag);
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!post.getUser().getEmail().equals(email)) {
                throw new SecurityException("Unauthorized to update this post");
            }
            post.setTitle(updatedPost.getTitle());
            post.setContent(updatedPost.getContent());
            post.setMediaUrls(updatedPost.getMediaUrls());
            post.setFileTypes(updatedPost.getFileTypes());
            post.setTags(updatedPost.getTags());
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }

    public void deletePost(String id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!post.get().getUser().getEmail().equals(email)) {
                throw new SecurityException("Unauthorized to delete this post");
            }
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found");
        }
    }
}