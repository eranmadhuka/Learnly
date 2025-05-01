package com.app.learnly.repositories;

import com.app.learnly.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);
    Like findByPostIdAndUserId(String postId, String userId);
}
