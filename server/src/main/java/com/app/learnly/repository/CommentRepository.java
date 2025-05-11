<<<<<<< HEAD:server/src/main/java/com/app/learnly/repositories/CommentRepository.java
package com.app.learnly.repositories;

import com.app.learnly.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
=======
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
>>>>>>> main:server/src/main/java/com/app/learnly/repository/CommentRepository.java
