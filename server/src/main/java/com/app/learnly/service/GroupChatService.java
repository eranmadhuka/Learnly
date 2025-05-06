package com.app.learnly.service;

import com.app.learnly.model.Group;
import com.app.learnly.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupChatService {
    @Autowired
    private MongoTemplate mongoTemplate;

    public Group createGroup(Group group) {
        group.setCreatedAt(System.currentTimeMillis());
        mongoTemplate.save(group, "groups");
        return group;
    }

    public List<Group> getGroupsByUser(String userId) {
        return mongoTemplate.find(
                Query.query(Criteria.where("members").in(userId)),
                Group.class,
                "groups"
        );
    }

    public Group joinGroup(String groupId, String userId) {
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").is(groupId)),
                new Update().addToSet("members", userId),
                Group.class,
                "groups"
        );
        return mongoTemplate.findById(groupId, Group.class, "groups");
    }

    public Message saveMessage(Message message) {
        message.setTimestamp(System.currentTimeMillis());
        message.setStatus("sent");
        mongoTemplate.save(message, "messages");
        // Update group's lastMessageId
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").is(message.getGroupId())),
                new Update().set("lastMessageId", message.getId()),
                Group.class,
                "groups"
        );
        return message;
    }

    public List<Message> getGroupMessages(String groupId) {
        return mongoTemplate.find(
                Query.query(Criteria.where("groupId").is(groupId))
                        .with(Sort.by(Sort.Direction.ASC, "timestamp")),
                Message.class,
                "messages"
        );
    }
}
