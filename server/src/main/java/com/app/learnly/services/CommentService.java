package com.app.learnly.services;

import com.app.learnly.models.Comment;
import com.app.learnly.models.User;
import com.app.learnly.repositories.CommentRepository;
import com.app.learnly.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        comments.forEach(comment -> {
            Optional<User> userOpt = userRepository.findByProviderId(comment.getUserId());
            userOpt.ifPresent(user -> {
                comment.setUserDisplayName(user.getName());
                comment.setUserPicture(user.getPicture());
            });
        });
        return comments;
    }

    public Optional<Comment> updateComment(String id, String newContent) {
        Optional<Comment> commentOpt = commentRepository.findById(id);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setContent(newContent);
            return Optional.of(commentRepository.save(comment));
        }
        return Optional.empty();
    }

    public boolean deleteComment(String id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
