package com.app.learnly.controller;

import com.app.learnly.model.Message;
import com.app.learnly.service.GroupChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class GroupChatController {

    @Autowired
    private GroupChatService groupChatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/group/sendMessage")
    public void sendMessage(@Payload Message message, StompHeaderAccessor accessor) {
        try {
            // Get providerId from WebSocket session
            String providerId = accessor.getUser() != null ? accessor.getUser().getName() : null;
            if (providerId == null) {
                throw new IllegalStateException("User not authenticated");
            }

            // Map providerId to User _id
            String senderId = groupChatService.getUserIdByProviderId(providerId);
            if (senderId == null) {
                throw new IllegalStateException("User not found for providerId: " + providerId);
            }

            // Set message fields
            message.setSenderId(senderId);
            message.setSenderName(groupChatService.getUserNameById(senderId));
            message.setTimestamp(System.currentTimeMillis());
            message.setStatus("sent");

            // Save and broadcast message
            Message savedMessage = groupChatService.saveMessage(message);
            messagingTemplate.convertAndSend("/topic/group/" + message.getGroupId(), savedMessage);
        } catch (Exception e) {
            System.err.println("Failed to send message: " + e.getMessage());
            throw e;
        }
    }
}