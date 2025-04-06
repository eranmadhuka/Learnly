
package com.app.learnly.services;

import com.app.learnly.models.ProgressUpdate;
import com.app.learnly.repositories.ProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate) {
        progressUpdate.setCreatedAt(new Date());
        progressUpdate.setUpdatedAt(new Date());
        return progressUpdateRepository.save(progressUpdate);
    }

    public List<ProgressUpdate> getProgressUpdatesByUserId(String userId) {
        return progressUpdateRepository.findByUserId(userId);
    }

    public List<ProgressUpdate> getProgressUpdatesByPlanId(String planId) {
        return progressUpdateRepository.findByLearningPlanId(planId);
    }

    public Optional<ProgressUpdate> getProgressUpdateById(String id) {
        return progressUpdateRepository.findById(id);
    }

    public ProgressUpdate updateProgressUpdate(String id, ProgressUpdate updatedUpdate) {
        Optional<ProgressUpdate> existingUpdate = progressUpdateRepository.findById(id);

        if (existingUpdate.isPresent()) {
            ProgressUpdate update = existingUpdate.get();

            // Update fields but keep original ID and creation date
            updatedUpdate.setId(id);
            updatedUpdate.setCreatedAt(update.getCreatedAt());
            updatedUpdate.setUpdatedAt(new Date());

            return progressUpdateRepository.save(updatedUpdate);
        }

        return null;
    }

    public boolean deleteProgressUpdate(String id) {
        Optional<ProgressUpdate> update = progressUpdateRepository.findById(id);

        if (update.isPresent()) {
            progressUpdateRepository.deleteById(id);
            return true;
        }

        return false;
    }
}