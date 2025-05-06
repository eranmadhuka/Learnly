package com.app.learnly.repository;

import com.app.learnly.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByMembersContaining(String userId);
}