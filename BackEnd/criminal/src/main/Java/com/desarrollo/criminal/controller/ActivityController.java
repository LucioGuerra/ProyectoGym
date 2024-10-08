package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.ActivityDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.service.ActivityService;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/public/activities")
public class ActivityController {
    private final ActivityService activityService;

    @GetMapping
    public  ResponseEntity<List<Activity>> getAllActivities(){
        return activityService.getAllActivities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
            Activity activity = activityService.getActivityById(id);
            return ResponseEntity.status(HttpStatus.OK).body(activity);
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody ActivityDTO activityDTO) {
        return activityService.createActivity(activityDTO);
    }
/*
    @PatchMapping
    public ResponseEntity<Activity> updateActivity(@RequestBody ActivityDTO activityDTO) {
        return activityService.updateActivity(activityDTO);
    }

    @DeleteMapping
    public ResponseEntity<Activity> deleteActivity(@RequestBody ActivityDTO activityDTO) {
        return activityService.deleteActivity(activityDTO);
    }*/
}