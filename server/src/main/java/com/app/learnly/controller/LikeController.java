<<<<<<< HEAD:server/src/main/java/com/app/learnly/controllers/LikeController.java
package com.app.learnly.controllers;

import com.app.learnly.models.Like;
import com.app.learnly.services.LikeService;
import org.springframework.http.ResponseEntity;
=======
package com.app.learnly.controller;

import com.app.learnly.model.Like;
import com.app.learnly.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
>>>>>>> main:server/src/main/java/com/app/learnly/controller/LikeController.java
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {
<<<<<<< HEAD:server/src/main/java/com/app/learnly/controllers/LikeController.java
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<Like> createLike(@RequestBody Like like) {
        return ResponseEntity.ok(likeService.createLike(like));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPost(@PathVariable String postId) {
        return ResponseEntity.ok(likeService.getLikesByPostId(postId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Like>> getLikesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(likeService.getLikesByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable String id) {
        if (likeService.deleteLike(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Void> deleteLikeByPostIdAndUserId(@PathVariable String postId, @PathVariable String userId) {
        if (likeService.deleteLikeByPostIdAndUserId(postId, userId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
=======

    @Autowired
    private LikeService likeService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<Like> likePost(
            @PathVariable String postId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            Like like = likeService.likePost(postId, principal);
            return ResponseEntity.ok(like);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("User already liked this post")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            likeService.unlikePost(postId, principal);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable String postId) {
        try {
            List<Like> likes = likeService.getLikesByPostId(postId);
            return ResponseEntity.ok(likes);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
>>>>>>> main:server/src/main/java/com/app/learnly/controller/LikeController.java
