package com.app.learnly.controllers;

import com.app.learnly.models.Like;
import com.app.learnly.services.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {
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
