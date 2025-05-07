package com.app.learnly.repository;

import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUser(User user);
    List<Post> findByTagsContaining(String tag);
    List<Post> findByIdIn(List<String> postIds);
    Optional<Post> findByIdAndLikesContaining(String postId, String userId);
}