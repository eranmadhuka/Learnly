package com.app.learnly.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.messaging.Message;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByGroupIdOrderByTimestampAsc(String groupId);
}
