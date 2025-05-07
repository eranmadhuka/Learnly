package com.app.learnly.repository;

import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUser(User user);
    List<Post> findByTagsContaining(String tag);
    List<Post> findByUserIn(List<User> users);
    List<Post> findByIdIn(List<String> postIds);
}