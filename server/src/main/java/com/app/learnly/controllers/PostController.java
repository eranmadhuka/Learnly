package com.app.learnly.controllers;

import com.app.learnly.models.Post;
import com.app.learnly.models.User;
import com.app.learnly.repositories.PostRepository;
import com.app.learnly.repositories.UserRepository;
import com.app.learnly.services.PostService;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Post savedPost = postService.createPost(post, user.getId());
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable String postId, @RequestBody Post postUpdates, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Post> existingPost = postService.findById(postId);
            if (existingPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            Post post = existingPost.get();
            if (!post.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this post");
            }

            Post updatedPost = postService.updatePost(postId, postUpdates);

            return ResponseEntity.ok("Post updated successfully"); // ✅ Success Message
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the post");
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUserId(@PathVariable String userId) {
        try {
            List<Post> posts = postService.getPostsByUserId(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching posts");
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeedPosts() {
        try {
            List<Post> posts = postService.getFeedPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching feed posts");
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        try {
            return postService.getPostById(postId)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the post");
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Post> existingPost = postService.findById(postId);
            if (existingPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            Post post = existingPost.get();
            if (!post.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this post");
            }

            postService.deletePost(postId);

            return ResponseEntity.ok("Post deleted successfully"); // ✅ Success Message
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the post");
        }
    }

}
