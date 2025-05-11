<<<<<<< HEAD:server/src/main/java/com/app/learnly/services/LikeService.java
package com.app.learnly.services;

import com.app.learnly.models.Like;
import com.app.learnly.repositories.LikeRepository;
import org.springframework.stereotype.Service;
=======
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
>>>>>>> main:server/src/main/java/com/app/learnly/service/LikeService.java

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {
<<<<<<< HEAD:server/src/main/java/com/app/learnly/services/LikeService.java
    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public Like createLike(Like like) {
        // Check if user already liked the post
        Like existingLike = likeRepository.findByPostIdAndUserId(like.getPostId(), like.getUserId());
        if (existingLike != null) {
            // If already liked, unlike (delete the like)
            likeRepository.delete(existingLike);
            return null; // Return null indicating it was unliked
        }
        // If not liked, create new like
        return likeRepository.save(like);
    }

    public List<Like> getLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    public List<Like> getLikesByUserId(String userId) {
        return likeRepository.findByUserId(userId);
    }

    public Optional<Like> getLikeById(String id) {
        return likeRepository.findById(id);
    }

    public boolean deleteLike(String id) {
        if (likeRepository.existsById(id)) {
            likeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteLikeByPostIdAndUserId(String postId, String userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId);
        if (like != null) {
            likeRepository.delete(like);
            return true;
        }
        return false;
    }
}
=======

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
>>>>>>> main:server/src/main/java/com/app/learnly/service/LikeService.java
