package com.desarrollo.criminal.service;


import com.desarrollo.criminal.entity.tracking.DateWeight;
import com.desarrollo.criminal.entity.tracking.Tracking;
import com.desarrollo.criminal.repository.TrackingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@AllArgsConstructor
@Service
public class TrackingService {
    private final TrackingRepository trackingRepository;
    private final ExerciseService exerciseService;


    public Tracking createTracking(long exerciseId){
        Tracking tracking = new Tracking();
        tracking.setExercise(exerciseService.getExerciseById(exerciseId));
        trackingRepository.save(tracking);
        return tracking;
    }

    public void deleteTracking(Long id){
        trackingRepository.deleteById(id);
    }

    public void updateTracking(Tracking tracking, DateWeight dateWeight){
        tracking.addDateWeight(dateWeight);
    }

    public Tracking getTrackingOfUserByExerciseId(List<Tracking> trackingList, Long exerciseID) {
        for (Tracking tracking : trackingList) {
            if (tracking.getExercise().getId().equals(exerciseID)) {
                return tracking;
            }
        }
        return null;
    }
}
