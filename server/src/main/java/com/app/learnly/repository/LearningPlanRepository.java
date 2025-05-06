package com.app.learnly.repository;

import com.app.learnly.model.LearningPlan;
import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUser(User user);
    List<LearningPlan> findByIsPublic(boolean isPublic);
}