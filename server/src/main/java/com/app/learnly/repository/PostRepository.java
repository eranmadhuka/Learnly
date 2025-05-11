package com.app.learnly.repository;

import com.app.learnly.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUser(com.app.learnly.model.User user);
    List<Post> findByTagsContaining(String tag);
}