package com.app.learnly.controller;

import com.app.learnly.model.Group;
import com.app.learnly.model.Message;
import com.app.learnly.service.GroupChatService;
import com.app.learnly.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupChatService groupChatService;

    @Autowired
    private com.app.learnly.repository.MessageRepository messageRepository;

    @Autowired
    private com.app.learnly.repository.GroupRepository groupRepository;

    @GetMapping
    public ResponseEntity<List<Group>> getUserGroups(@RequestParam String userId) {
        try {
            List<Group> groups = groupChatService.getGroupsByUser(userId);
            List<Group> enrichedGroups = groups.stream().map(group -> {
                group.setIsMember(groupChatService.isUserMemberOfGroup(userId, group.getId()));
                return group;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(enrichedGroups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        try {
            Group createdGroup = groupChatService.createGroup(group);
            return ResponseEntity.ok(createdGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<Group> joinGroup(@PathVariable String groupId, @RequestParam String userId) {
        try {
            Optional<Group> groupOpt = groupRepository.findById(groupId);
            if (!groupOpt.isPresent()) {
                return ResponseEntity.badRequest().body(null);
            }
            Group group = groupOpt.get();
            if (!group.getMembers().contains(userId)) {
                group.getMembers().add(userId);
                group = groupRepository.save(group);
            }
            return ResponseEntity.ok(group);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable String groupId) {
        try {
            // Verify group exists
            Optional<Group> groupOpt = groupRepository.findById(groupId);
            if (!groupOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            // Fetch messages
            List<Message> messages = messageRepository.findByGroupId(groupId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}