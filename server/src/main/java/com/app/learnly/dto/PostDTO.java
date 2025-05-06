package com.app.learnly.dto;

import com.app.learnly.models.Post;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class PostDTO {
    private String id;
    private String title;
    private String content;
    private List<String> mediaUrls;
    private List<String> fileTypes;
    private List<String> tags;
    private UserDTO user;
    private Date createdAt;

    public static PostDTO fromEntity(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setMediaUrls(post.getMediaUrls());
        dto.setFileTypes(post.getFileTypes());
        dto.setTags(post.getTags());
        dto.setUser(UserDTO.fromEntity(post.getUser()));
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public List<String> getFileTypes() {
        return fileTypes;
    }

    public void setFileTypes(List<String> fileTypes) {
        this.fileTypes = fileTypes;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}