package com.app.learnly.controllers;

import com.app.learnly.dto.PostDTO;
import com.app.learnly.dto.UserDTO;
import com.app.learnly.models.Post;
import com.app.learnly.models.User;
import com.app.learnly.repository.UserRepository;
import com.app.learnly.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @RequestBody Post post,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            User user = userOptional.get();
            Post savedPost = postService.createPost(post, user.getId());
            return new ResponseEntity<>(PostDTO.fromEntity(savedPost), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestBody Post postUpdates,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            User user = userOptional.get();
            Optional<Post> existingPost = postService.findById(postId);
            if (existingPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            Post post = existingPost.get();
            if (!post.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this post");
            }

            Post updatedPost = postService.updatePost(postId, postUpdates);
            return new ResponseEntity<>(PostDTO.fromEntity(updatedPost), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the post");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUserId(@PathVariable String userId) {
        try {
            List<Post> posts = postService.getPostsByUserId(userId);
            List<PostDTO> postDTOs = posts.stream()
                    .map(PostDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching posts");
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeedPosts() {
        try {
            List<Post> posts = postService.getFeedPosts();
            List<PostDTO> postDTOs = posts.stream()
                    .map(PostDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching feed posts");
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        try {
            Optional<Post> postOptional = postService.getPostById(postId);
            return postOptional
                    .map(post -> ResponseEntity.ok(PostDTO.fromEntity(post)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the post");
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable String postId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null || principal.getAttribute("email") == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            String email = principal.getAttribute("email");
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            User user = userOptional.get();
            Optional<Post> existingPost = postService.findById(postId);
            if (existingPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            Post post = existingPost.get();
            if (!post.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this post");
            }

            postService.deletePost(postId);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the post");
        }
    }
}