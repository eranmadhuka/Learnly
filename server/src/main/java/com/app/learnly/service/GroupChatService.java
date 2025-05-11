package com.app.learnly.service;

import com.app.learnly.model.Group;
import com.app.learnly.model.Message;
import com.app.learnly.model.User;
import com.app.learnly.repository.GroupRepository;
import com.app.learnly.repository.MessageRepository;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupChatService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getGroupsByUser(String userId) {
        // Return all groups, regardless of membership
        return groupRepository.findAll();
    }

    public boolean isUserMemberOfGroup(String userId, String groupId) {
        Optional<Group> group = groupRepository.findById(groupId);
        return group.isPresent() && group.get().getMembers().contains(userId);
    }

    public Group createGroup(Group group) {
        if (group.getCreatedBy() == null) {
            throw new IllegalArgumentException("Group creator is required");
        }
        if (group.getMembers() == null || group.getMembers().isEmpty()) {
            group.setMembers(List.of(group.getCreatedBy()));
        }
        if (group.getCreatedAt() == null) {
            group.setCreatedAt(System.currentTimeMillis());
        }
        return groupRepository.save(group);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public String getUserIdByProviderId(String providerId) {
        Optional<User> user = userRepository.findByProviderId(providerId);
        return user.map(User::getId).orElse(null);
    }

    public String getUserNameById(String userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(User::getName).orElse("Unknown");
    }
}