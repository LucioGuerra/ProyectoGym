package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.ActivityDTO;
import com.desarrollo.criminal.dto.request.ActivityUpdateDTO;
import com.desarrollo.criminal.dto.response.GetActivityDTO;
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
    public  ResponseEntity<List<GetActivityDTO>> getAllActivities(){
        return activityService.getAllActivities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetActivityDTO> getActivityById(@PathVariable Long id) {
        return activityService.getAcitivityDTOById(id);
    }

    @PostMapping
    public ResponseEntity<?> createActivity(@RequestBody ActivityDTO activityDTO) {
        return activityService.createActivity(activityDTO);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateActivity(@RequestBody ActivityUpdateDTO activityDTO, @PathVariable Long id) {
        return activityService.updateActivity(activityDTO, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity (@PathVariable Long id) {
        return activityService.deleteActivity(id);
    }
}