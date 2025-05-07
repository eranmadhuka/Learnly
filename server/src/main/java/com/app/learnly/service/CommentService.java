package com.app.learnly.service;

import com.app.learnly.model.Comment;
import com.app.learnly.model.User;
import com.app.learnly.repository.CommentRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment createComment(Comment comment, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            comment.setUser(userOptional.get());
            comment.setCreatedAt(new Date());
            return commentRepository.save(comment);
        }
        throw new RuntimeException("User not found");
    }

    public List<Comment> getCommentsByPost(String postId) {
        return commentRepository.findByPostId(postId);
    }
}