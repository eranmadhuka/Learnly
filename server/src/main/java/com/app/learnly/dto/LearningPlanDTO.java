package com.app.learnly.dto;

import com.app.learnly.model.LearningPlan;
import com.app.learnly.model.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class LearningPlanDTO {

    private String id;
    private String userId;
    private String userEmail;
    private String title;
    private String description;
    private List<TopicDTO> topics;
    private Date createdAt;
    private Date updatedAt;
    private Date completionDate;
    private List<String> followers;
    private boolean isPublic;

    public LearningPlanDTO() {
        this.topics = new ArrayList<>();
        this.followers = new ArrayList<>();
    }

    // Conversion methods
    public static LearningPlanDTO fromEntity(LearningPlan entity) {
        if (entity == null) {
            return null;
        }

        LearningPlanDTO dto = new LearningPlanDTO();
        dto.setId(entity.getId());

        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUserEmail(entity.getUser().getEmail());
        }

        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());

        if (entity.getTopics() != null) {
            dto.setTopics(entity.getTopics().stream()
                    .map(TopicDTO::fromEntity)
                    .collect(Collectors.toList()));
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setCompletionDate(entity.getCompletionDate());
        dto.setFollowers(entity.getFollowers());
        dto.setPublic(entity.isPublic());

        return dto;
    }

    public LearningPlan toEntity() {
        LearningPlan entity = new LearningPlan();
        entity.setId(this.id);
        // User will be set by the controller
        entity.setTitle(this.title);
        entity.setDescription(this.description);

        if (this.topics != null) {
            entity.setTopics(this.topics.stream()
                    .map(TopicDTO::toEntity)
                    .collect(Collectors.toList()));
        }

        entity.setCreatedAt(this.createdAt);
        entity.setUpdatedAt(this.updatedAt);
        entity.setCompletionDate(this.completionDate);
        entity.setFollowers(this.followers);
        entity.setIsPublic(this.isPublic);

        return entity;
    }

    // Inner classes for Topic and Resource DTOs
    public static class TopicDTO {
        private String title;
        private String description;
        private List<ResourceDTO> resources;
        private boolean completed;

        public TopicDTO() {
            this.resources = new ArrayList<>();
        }

        public static TopicDTO fromEntity(LearningPlan.Topic entity) {
            if (entity == null) {
                return null;
            }

            TopicDTO dto = new TopicDTO();
            dto.setTitle(entity.getTitle());
            dto.setDescription(entity.getDescription());

            if (entity.getResources() != null) {
                dto.setResources(entity.getResources().stream()
                        .map(ResourceDTO::fromEntity)
                        .collect(Collectors.toList()));
            }

            dto.setCompleted(entity.isCompleted());

            return dto;
        }

        public LearningPlan.Topic toEntity() {
            LearningPlan.Topic entity = new LearningPlan.Topic();
            entity.setTitle(this.title);
            entity.setDescription(this.description);

            if (this.resources != null) {
                entity.setResources(this.resources.stream()
                        .map(ResourceDTO::toEntity)
                        .collect(Collectors.toList()));
            }

            entity.setCompleted(this.completed);

            return entity;
        }

        // Getters and setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<ResourceDTO> getResources() {
            return resources;
        }

        public void setResources(List<ResourceDTO> resources) {
            this.resources = resources;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }

    public static class ResourceDTO {
        private String title;
        private String url;
        private String type;

        public static ResourceDTO fromEntity(LearningPlan.Resource entity) {
            if (entity == null) {
                return null;
            }

            ResourceDTO dto = new ResourceDTO();
            dto.setTitle(entity.getTitle());
            dto.setUrl(entity.getUrl());
            dto.setType(entity.getType());

            return dto;
        }

        public LearningPlan.Resource toEntity() {
            LearningPlan.Resource entity = new LearningPlan.Resource();
            entity.setTitle(this.title);
            entity.setUrl(this.url);
            entity.setType(this.type);

            return entity;
        }

        // Getters and setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    // Getters and setters for LearningPlanDTO
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TopicDTO> getTopics() {
        return topics;
    }

    public void setTopics(List<TopicDTO> topics) {
        this.topics = topics;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Date getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Date completionDate) {
        this.completionDate = completionDate;
    }

    public List<String> getFollowers() {
        return followers;
    }

    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}