package com.app.learnly.repository;

import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByEmailNot(String email);
    List<User> findAllById(Iterable<String> ids);
}