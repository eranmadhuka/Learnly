package com.app.learnly.services;

import com.app.learnly.models.Like;
import com.app.learnly.repositories.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {
    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public Like createLike(Like like) {
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
