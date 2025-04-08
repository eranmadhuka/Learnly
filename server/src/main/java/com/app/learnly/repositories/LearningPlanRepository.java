package com.app.learnly.repositories;

import com.app.learnly.models.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan,String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findByVisibility(String visibility); // For public plans
}
