package com.app.learnly.repository;

import com.app.learnly.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByGroupId(String groupId);
}