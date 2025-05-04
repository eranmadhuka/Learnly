package com.app.learnly.repositories;

import com.app.learnly.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByMembersContaining(String userId);
}
