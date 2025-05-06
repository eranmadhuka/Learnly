package com.app.learnly.controllers;

import com.app.learnly.models.Group;
import com.app.learnly.models.Message;
import com.app.learnly.services.GroupChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    @Autowired
    private GroupChatService groupChatService;

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        System.out.println(group);
        return ResponseEntity.ok(groupChatService.createGroup(group));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<Group> joinGroup(@PathVariable String groupId, @RequestParam String userId) {
        return ResponseEntity.ok(groupChatService.joinGroup(groupId, userId));
    }

    @GetMapping
    public ResponseEntity<List<Group>> getUserGroups(@RequestParam String userId) {
        return ResponseEntity.ok(groupChatService.getGroupsByUser(userId));
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable String groupId) {
        return ResponseEntity.ok(groupChatService.getGroupMessages(groupId));
    }
}