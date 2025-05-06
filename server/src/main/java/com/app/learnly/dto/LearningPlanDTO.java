package com.app.learnly.dto;

import com.app.learnly.models.LearningPlan;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class LearningPlanDTO {
    private String id;
    private UserDTO user;
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

    public static LearningPlanDTO fromEntity(LearningPlan plan) {
        LearningPlanDTO dto = new LearningPlanDTO();
        dto.setId(plan.getId());
        dto.setUser(UserDTO.fromEntity(plan.getUser()));
        dto.setTitle(plan.getTitle());
        dto.setDescription(plan.getDescription());
        dto.setTopics(plan.getTopics().stream()
                .map(TopicDTO::fromEntity)
                .collect(Collectors.toList()));
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());
        dto.setCompletionDate(plan.getCompletionDate());
        dto.setFollowers(plan.getFollowers());
        dto.setIsPublic(plan.isPublic());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
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

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public static class TopicDTO {
        private String title;
        private String description;
        private List<ResourceDTO> resources;
        private boolean completed;

        public TopicDTO() {
            this.resources = new ArrayList<>();
        }

        public static TopicDTO fromEntity(LearningPlan.Topic topic) {
            TopicDTO dto = new TopicDTO();
            dto.setTitle(topic.getTitle());
            dto.setDescription(topic.getDescription());
            dto.setResources(topic.getResources().stream()
                    .map(ResourceDTO::fromEntity)
                    .collect(Collectors.toList()));
            dto.setCompleted(topic.isCompleted());
            return dto;
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

        public static ResourceDTO fromEntity(LearningPlan.Resource resource) {
            ResourceDTO dto = new ResourceDTO();
            dto.setTitle(resource.getTitle());
            dto.setUrl(resource.getUrl());
            dto.setType(resource.getType());
            return dto;
        }

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
}