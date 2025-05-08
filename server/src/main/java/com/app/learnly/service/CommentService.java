package com.app.learnly.service;

import com.app.learnly.model.Comment;
import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import com.app.learnly.repository.CommentRepository;
import com.app.learnly.repository.PostRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment createComment(String postId, Comment comment, OAuth2User principal) {
        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        if (providerId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        User user = userOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with providerId: " + providerId));

        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(new java.util.Date());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        return commentRepository.findByPost(post);
    }

    public Comment updateComment(String commentId, Comment updatedComment, OAuth2User principal) {
        Optional<Comment> existingCommentOptional = commentRepository.findById(commentId);
        if (!existingCommentOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }

        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        if (providerId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        User user = userOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with providerId: " + providerId));

        Comment comment = existingCommentOptional.get();
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to update this comment");
        }

        comment.setContent(updatedComment.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, OAuth2User principal) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }

        String providerId = principal.getAttribute("sub") != null
                ? principal.getAttribute("sub")
                : principal.getAttribute("id");
        if (providerId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Optional<User> userOptional = userRepository.findByProviderId(providerId);
        User user = userOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with providerId: " + providerId));

        Comment comment = commentOptional.get();
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to delete this comment");
        }

        commentRepository.deleteById(commentId);
    }
}