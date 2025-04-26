package com.app.learnly.services;

import com.app.learnly.models.Post;
import com.app.learnly.models.User;
import com.app.learnly.repositories.PostRepository;
import com.app.learnly.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling post-related business logic in Learnly.
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;



    // --- Core Post Operations ---

    public Optional<Post> findById(String postId) {
        return postRepository.findById(postId);
    }

    public Post createPost(Post post, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        post.setUser(user);
        post.setCreatedAt(new Date());
        return postRepository.save(post);
    }

    public Post updatePost(String postId, Post postUpdates) {
        return postRepository.findById(postId)
                .map(existingPost -> {
                    existingPost.setTitle(postUpdates.getTitle());
                    existingPost.setContent(postUpdates.getContent());
                    existingPost.setMediaUrls(postUpdates.getMediaUrls());
                    existingPost.setFileTypes(postUpdates.getFileTypes());
                    existingPost.setTags(postUpdates.getTags());
                    return postRepository.save(existingPost);
                })
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
    }

    public void deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
        postRepository.delete(post);
    }

    // --- Fetch Posts ---

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> getFeedPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public List<Post> getFollowingPosts(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<String> followingUserIds = user.getFollowing();
        if (followingUserIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<User> followingUsers = userRepository.findByIdIn(followingUserIds);
        return postRepository.findByUserIn(followingUsers);
    }

//    // --- Likes Management ---
//
//    public LikeResponse togglePostLike(String postId, String userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
//        Post post = postRepository.findById(postId)
//                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
//
//        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());
//        boolean isLiked;
//
//        if (existingLike.isPresent()) {
//            likeRepository.delete(existingLike.get());
//            isLiked = false;
//        } else {
//            notificationService.notifyLike(user.getName(), post.getUser().getId());
//            Like like = new Like();
//            like.setPostId(postId);
//            like.setUser(user);
//            like.setCreatedAt(new Date());
//            likeRepository.save(like);
//            isLiked = true;
//        }
//
//        long likeCount = likeRepository.countByPostId(postId);
//        return new LikeResponse(likeCount, isLiked);
//    }
//
//    public long getLikeCount(String postId) {
//        return likeRepository.countByPostId(postId);
//    }
//
//    public List<Like> getLikesForPost(String postId) {
//        return likeRepository.findByPostId(postId);
//    }
//
//    public boolean hasUserLikedPost(String postId, String userId) {
//        return userRepository.findById(userId)
//                .flatMap(user -> likeRepository.findByPostIdAndUserId(postId, user.getId()))
//                .isPresent();
//    }

    // --- DTO for Like Response ---

    public static class LikeResponse {
        private final long likeCount;
        private final boolean liked;

        public LikeResponse(long likeCount, boolean liked) {
            this.likeCount = likeCount;
            this.liked = liked;
        }

        public long getLikeCount() {
            return likeCount;
        }

        public boolean isLiked() {
            return liked;
        }
    }
}
