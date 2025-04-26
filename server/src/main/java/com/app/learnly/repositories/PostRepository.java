package com.app.learnly.repositories;

import com.app.learnly.models.Post;
import com.app.learnly.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    /**
     * Find all posts by a user's MongoDB ObjectId (String).
     * This uses dot notation to match the user._id field inside the DBRef or embedded document.
     */
    @Query("{ 'user.id' : ?0 }")
    List<Post> findByUserId(String userId);

    /**
     * Find all posts sorted by creation date in descending order.
     */
    List<Post> findAllByOrderByCreatedAtDesc();

    /**
     * Find posts where the user is in the provided list of users.
     */
    List<Post> findByUserIn(List<User> users);

    /**
     * Find posts by a list of post IDs.
     */
    List<Post> findByIdIn(List<String> ids);

    /**
     * Delete all posts by a user's MongoDB ObjectId (String).
     */
    void deleteAllByUserId(String userId); // No need for @Query if method name matches convention
}
