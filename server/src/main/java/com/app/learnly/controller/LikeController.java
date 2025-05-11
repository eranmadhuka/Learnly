package com.app.learnly.controller;

import com.app.learnly.model.Like;
import com.app.learnly.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

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