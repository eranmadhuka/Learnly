package com.app.learnly.repository;

import com.app.learnly.model.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserId(String userId);
    List<ProgressUpdate> findByLearningPlanId(String learningPlanId);
}
