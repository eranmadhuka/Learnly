package com.app.learnly.controller;

import com.app.learnly.model.Comment;
import com.app.learnly.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/{postId}/all")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, @RequestParam String userId) {
        Comment createdComment = commentService.createComment(comment, userId);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }
}