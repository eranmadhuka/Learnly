package com.app.learnly.controllers;

import com.app.learnly.models.Message;
import com.app.learnly.services.GroupChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GroupChatController {
    @Autowired
    private GroupChatService groupChatService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/group/sendMessage")
    public void sendMessage(@Payload Message message) {
        Message savedMessage = groupChatService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/group/" + message.getGroupId(), savedMessage);
    }
}
