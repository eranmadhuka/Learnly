package com.app.learnly.repository;

import com.app.learnly.model.Comment;
import com.app.learnly.model.Post;
import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPost(Post post);
    List<Comment> findByUser(User user);
    void deleteByPost(Post post);
}
