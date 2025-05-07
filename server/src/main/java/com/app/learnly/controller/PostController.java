package com.app.learnly.controller;

import com.app.learnly.model.Post;
import com.app.learnly.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @RequestParam String userId) {
        try {
            Post createdPost = postService.createPost(post, userId);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Post post = postService.getPostById(id);
        if (post != null) {
            return new ResponseEntity<>(post, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    // Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUser(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Get posts by tag
    @GetMapping("/tags")
    public ResponseEntity<List<Post>> getPostsByTag(@RequestParam String tag) {
        List<Post> posts = postService.getPostsByTag(tag);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Update a post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        Post updatedPost = postService.updatePost(id, post);
        if (updatedPost != null) {
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        boolean deleted = postService.deletePost(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/users/{userId}/saved")
    public ResponseEntity<List<Post>> getSavedPosts(@PathVariable String userId) {
        List<Post> savedPosts = postService.getSavedPosts(userId);
        return new ResponseEntity<>(savedPosts, HttpStatus.OK);
    }

    @GetMapping("/{id}/like-count")
    public ResponseEntity<Integer> getLikeCount(@PathVariable String id) {
        Post post = postService.getPostById(id);
        return new ResponseEntity<>(post != null ? post.getLikes().size() : 0, HttpStatus.OK);
    }

    @GetMapping("/{id}/has-liked")
    public ResponseEntity<Boolean> hasLiked(@PathVariable String id, @RequestParam String userId) {
        Post post = postService.getPostById(id);
        boolean hasLiked = post != null && post.getLikes().contains(userId);
        return new ResponseEntity<>(hasLiked, HttpStatus.OK);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable String id, @RequestParam String userId) {
        postService.toggleLike(id, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}