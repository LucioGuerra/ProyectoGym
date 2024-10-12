package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ActivityDTO;
import com.desarrollo.criminal.dto.request.ActivityUpdateDTO;
import com.desarrollo.criminal.dto.response.GetActivityDTO;
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

    public ResponseEntity<List<GetActivityDTO>> getAllActivities() {
        List<Activity> activities = activityRepository.findAllNotDeleted();
        return ResponseEntity.status(HttpStatus.OK).body(activities.stream().map(activity -> modelMapper.map(activity,
                GetActivityDTO.class)).toList());
    }

    public Activity getActivityById(Long id) {
        return activityRepository.findByIdAndNotDeleted(id).orElseThrow(() -> new EntityNotFoundException("activity " +
                "not found " +
                "with: " + id));
    }

    public ResponseEntity<GetActivityDTO> getAcitivityDTOById(Long id) {
        Activity activity = activityRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("activity " +
                "not found with: " + id));

        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(activity, GetActivityDTO.class));
    }

    public ResponseEntity<Activity> createActivity(ActivityDTO activityDTO) {
        activityRepository.save(modelMapper.map(activityDTO, Activity.class));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<Activity> updateActivity(ActivityUpdateDTO activityDTO, Long id) {
        Activity activity =
                activityRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("activity" +
                        " " +
                "not found with: " + id));

        if (Optional.ofNullable(activityDTO.getName()).isPresent()) {
            activity.setName(activityDTO.getName());
        }
        if (Optional.ofNullable(activityDTO.getDescription()).isPresent()) {
            activity.setDescription(activityDTO.getDescription());
        }
        if (activityDTO.getPrice() != 0) {
            activity.setPrice(activityDTO.getPrice());
        }
        activityRepository.save(activity);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> deleteActivity(Long id) {
        Activity activity = activityRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("activity " +
                "not found with: " + id));
        activity.setSoftDelete(true);
        activityRepository.save(activity);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}