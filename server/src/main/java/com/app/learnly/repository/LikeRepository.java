<<<<<<< HEAD:server/src/main/java/com/app/learnly/repositories/LikeRepository.java
package com.app.learnly.repositories;

import com.app.learnly.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);
    Like findByPostIdAndUserId(String postId, String userId);
=======
package com.app.learnly.repository;

import com.app.learnly.model.Like;
import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPost(Post post);
    Optional<Like> findByUserAndPost(User user, Post post);
    void deleteByPost(Post post);
>>>>>>> main:server/src/main/java/com/app/learnly/repository/LikeRepository.java
}
