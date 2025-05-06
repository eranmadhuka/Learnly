package com.app.learnly.controllers;

import com.app.learnly.model.ProgressUpdate;
import com.app.learnly.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    public ResponseEntity<ProgressUpdate> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate createdUpdate = progressUpdateService.createProgressUpdate(progressUpdate);
        return new ResponseEntity<>(createdUpdate, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdate> getProgressUpdateById(@PathVariable String id) {
        Optional<ProgressUpdate> update = progressUpdateService.getProgressUpdateById(id);
        return update.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdate> updates = progressUpdateService.getProgressUpdatesByUserId(userId);
        return new ResponseEntity<>(updates, HttpStatus.OK);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByPlanId(@PathVariable String planId) {
        List<ProgressUpdate> updates = progressUpdateService.getProgressUpdatesByPlanId(planId);
        return new ResponseEntity<>(updates, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdate> updateProgressUpdate(@PathVariable String id, @RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate updatedUpdate = progressUpdateService.updateProgressUpdate(id, progressUpdate);

        if (updatedUpdate != null) {
            return new ResponseEntity<>(updatedUpdate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String id) {
        boolean deleted = progressUpdateService.deleteProgressUpdate(id);

        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}