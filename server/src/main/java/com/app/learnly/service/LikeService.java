package com.app.learnly.service;

import com.app.learnly.model.Like;
import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import com.app.learnly.repository.LikeRepository;
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
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Like likePost(String postId, OAuth2User principal) {
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

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);
        if (existingLike.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already liked this post");
        }

        Like like = new Like(user, post);
        return likeRepository.save(like);
    }

    public void unlikePost(String postId, OAuth2User principal) {
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

        Optional<Like> likeOptional = likeRepository.findByUserAndPost(user, post);
        if (!likeOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Like not found");
        }

        likeRepository.delete(likeOptional.get());
    }

    public List<Like> getLikesByPostId(String postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        return likeRepository.findByPost(post);
    }
}