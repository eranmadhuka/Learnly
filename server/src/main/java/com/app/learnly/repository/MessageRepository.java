package com.app.learnly.repository;

import com.app.learnly.models.Message;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByGroupIdOrderByTimestampAsc(String groupId);
}