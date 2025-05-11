<<<<<<< HEAD:server/src/main/java/com/app/learnly/models/Comment.java
package com.app.learnly.models;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String postId;  // To link comment to a post
    private String userId;  // Who commented
    private String content;
    private LocalDateTime createdAt;

    public Comment() {}

    public Comment(String postId, String userId, String content) {
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

=======
package com.app.learnly.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String content;

    @DBRef
    private User user;

    @DBRef
    private Post post;

    private Date createdAt;

    // Default constructor
    public Comment() {}

    // Constructor
    public Comment(String content, User user, Post post) {
        this.content = content;
        this.user = user;
        this.post = post;
        this.createdAt = new Date();
    }

    // Getters and Setters
>>>>>>> main:server/src/main/java/com/app/learnly/model/Comment.java
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

<<<<<<< HEAD:server/src/main/java/com/app/learnly/models/Comment.java
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

=======
>>>>>>> main:server/src/main/java/com/app/learnly/model/Comment.java
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

<<<<<<< HEAD:server/src/main/java/com/app/learnly/models/Comment.java
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
>>>>>>> main:server/src/main/java/com/app/learnly/model/Comment.java
        this.createdAt = createdAt;
    }
}
