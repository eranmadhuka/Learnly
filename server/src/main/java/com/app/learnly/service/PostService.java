package com.app.learnly.service;

import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import com.app.learnly.repository.PostRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Post createPost(Post post, OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        if (providerId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        User user = userOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with providerId: " + providerId));

        // Verify the user ID in the request matches the authenticated user
        if (!post.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to create post for this ID");
        }

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

    public List<Post> getPostsByUserId(String userId, OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> authenticatedUser = userRepository.findByProviderId(providerId);
        if (!authenticatedUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        // Allow fetching posts only for the authenticated user
        if (!authenticatedUser.get().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to access this user's posts");
        }

        return postRepository.findByUser(user.get());
    }

    public List<Post> getPostsByTag(String tag) {
        return postRepository.findByTagsContaining(tag);
    }

    public Post updatePost(String id, Post updatedPost, OAuth2User principal) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (!existingPost.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Post post = existingPost.get();
        if (!post.getUser().getId().equals(userOptional.get().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to update this post");
        }

        post.setTitle(updatedPost.getTitle());
        post.setContent(updatedPost.getContent());
        post.setMediaUrls(updatedPost.getMediaUrls());
        post.setFileTypes(updatedPost.getFileTypes());
        post.setTags(updatedPost.getTags());
        return postRepository.save(post);
    }

    public void deletePost(String id, OAuth2User principal) {
        Optional<Post> post = postRepository.findById(id);
        if (!post.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        if (!userOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        if (!post.get().getUser().getId().equals(userOptional.get().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to delete this post");
        }

        postRepository.deleteById(id);
    }
}