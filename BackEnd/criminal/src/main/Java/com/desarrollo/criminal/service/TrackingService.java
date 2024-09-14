package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.TrackingDTO;
import com.desarrollo.criminal.entity.tracking.Tracking;
import com.desarrollo.criminal.repository.TrackingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class TrackingService {
    private final TrackingRepository trackingRepository;
    private final ExerciseService exerciseService;
    public void createTracking(TrackingDTO trackingDTO){
        Tracking tracking = new Tracking();

        tracking.setExercise(exerciseService.getExerciseById(trackingDTO.getExerciseID()));
        trackingRepository.save(tracking);
    }

    public void deleteTracking(Long id){
        trackingRepository.deleteById(id);
    }

    public void updateTracking(Long id, Tracking tracking){
    }

    public Tracking SearchTrackingByUserIDAndExerciseID(Long userID, Long exerciseID) {
        Optional tracking = trackingRepository.findTrackingByUserIDAndExerciseID(userID, exerciseID);
        if (tracking.isPresent()) {
            return (Tracking) tracking.get();
        } else {
            TrackingDTO trackingDTO = new TrackingDTO();
            trackingDTO.setExerciseID(exerciseID);
            createTracking(trackingDTO);
            return ;
        }
    }
}
