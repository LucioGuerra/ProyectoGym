package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ActivityDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.repository.ActivityRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@AllArgsConstructor
@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ModelMapper modelMapper;

    public ResponseEntity<List<Activity>> getAllActivities() {
        List<Activity> activities = activityRepository.findAll();
        return ResponseEntity.ok(activities);
    }

    public Activity getActivityById(Long id) {
        return activityRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("activity not found"));
    }

    public ResponseEntity<Activity> createActivity(ActivityDTO activityDTO) {
        activityRepository.save(modelMapper.map(activityDTO, Activity.class));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public Set<Activity> getActivitiesByIds(List<Long> ids) {
        return activityRepository.findAllById(ids);
    }
}