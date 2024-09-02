package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities(){
        List<Activity> allActivities = activityService.getAllActivities();
        return ResponseEntity.status(HttpStatus.OK).body(allActivities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        Optional<Activity> activity = activityService.getActivityById(id);
        return ResponseEntity.status(HttpStatus.OK).body(activity.orElse(null));
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        Activity savedActivity = activityService.createActivity(activity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedActivity);
    }

    @DeleteMapping
    public ResponseEntity<Activity> deleteActivity(@RequestBody Activity activity) {
        activityService.deleteActivity(activity);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
