<<<<<<< HEAD:server/src/main/java/com/app/learnly/models/Like.java
package com.app.learnly.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "likes")
public class Like {
    @Id
    private String id;
    private String postId;  // Link to Post
    private String userId;  // Link to User
    private LocalDateTime createdAt;

    public Like() {}

    public Like(String postId, String userId) {
        this.postId = postId;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

=======
package com.app.learnly.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "likes")
public class Like {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Post post;

    private Date createdAt;

    // Default constructor
    public Like() {}

    // Constructor
    public Like(User user, Post post) {
        this.user = user;
        this.post = post;
        this.createdAt = new Date();
    }

    // Getters and Setters
>>>>>>> main:server/src/main/java/com/app/learnly/model/Like.java
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

<<<<<<< HEAD:server/src/main/java/com/app/learnly/models/Like.java
    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
=======
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
>>>>>>> main:server/src/main/java/com/app/learnly/model/Like.java
        this.createdAt = createdAt;
    }
}
