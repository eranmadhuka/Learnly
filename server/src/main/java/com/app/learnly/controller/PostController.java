package com.app.learnly.controller;

import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import com.app.learnly.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestBody Post post,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            Post createdPost = postService.createPost(post, principal);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(
            @PathVariable String userId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            List<Post> posts = postService.getPostsByUserId(userId, principal);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Post>> getPostsByTag(@PathVariable String tag) {
        List<Post> posts = postService.getPostsByTag(tag);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestBody Post post,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            Post updatedPost = postService.updatePost(id, post, principal);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return new ResponseEntity<>(null, e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            postService.deletePost(id, principal);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN);
        }
    }
}