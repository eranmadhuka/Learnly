package com.app.learnly.controller;

import com.app.learnly.model.Comment;
import com.app.learnly.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable String postId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            Comment createdComment = commentService.createComment(postId, comment, principal);
            return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        try {
            List<Comment> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            Comment updatedComment = commentService.updateComment(commentId, comment, principal);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            commentService.deleteComment(commentId, principal);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN);
        }
    }
}