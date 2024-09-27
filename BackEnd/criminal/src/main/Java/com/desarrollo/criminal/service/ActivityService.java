package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ActivityDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.repository.ActivityRepository;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ActivityService {
    private static ModelMapper modelMapper;
    private final ActivityRepository activityRepository;
/*
    public ResponseEntity<List<Activity>> getAllActivities() {
        List<Activity> activities = activityRepository.findAll();
        return ResponseEntity.ok(activities);
    }

    public ResponseEntity<Activity> getActivityById(Long id) {
        Optional<Activity> activity = activityRepository.findById(id);
        if (activity.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(activity.get());
        } else {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }
*/
    public ResponseEntity<Activity> createActivity(ActivityDTO activityDTO) {
        Activity activity = new Activity();

        activity.setName(activityDTO.getName());
        activity.setDescription(activityDTO.getDescription());

        activityRepository.save(activity);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
/*
    public ResponseEntity<Activity> deleteActivity(ActivityDTO activityDTO) {
        Optional<Activity> activity = activityRepository.findById(activityDTO.getId());

        if (activity.isPresent()) {
            activityRepository.delete(activity.get());
            ResponseEntity.status(HttpStatus.OK).build();
        } else {
            ResponseEntity.status(HttpStatus.OK).build();
        }
        return null;
    }

    public ResponseEntity<Activity> updateActivity(ActivityDTO activityDTO) {
        Optional<Activity> activity = activityRepository.findById(activityDTO.getId());

        if (activity.isPresent()) {

            activity.get().setName(activityDTO.getName());
            activity.get().setDescription(activityDTO.getDescription());

            activityRepository.save(activity.get());
            return ResponseEntity.status(HttpStatus.OK).body(activity.get());

        } else {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }*/

    public static Activity convertToEntity(ActivityDTO activityDTO) {
        return modelMapper.map(activityDTO, Activity.class);
    }
}