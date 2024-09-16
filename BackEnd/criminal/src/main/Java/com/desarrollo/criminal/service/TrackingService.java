package com.desarrollo.criminal.service;


import com.desarrollo.criminal.dto.request.ExerciseTrackingDTO;
import com.desarrollo.criminal.entity.tracking.DateWeight;
import com.desarrollo.criminal.entity.tracking.Tracking;
import com.desarrollo.criminal.repository.TrackingRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


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

    public void updateTracking(Tracking tracking, ExerciseTrackingDTO exerciseTrackingDTO){
        DateWeight dateWeight = new DateWeight();
        dateWeight.setWeight(exerciseTrackingDTO.getWeight());
        dateWeight.setDate(exerciseTrackingDTO.getDate());
        tracking.addDateWeight(dateWeight);
    }

    public Optional<Tracking> getTrackingOfUserByExerciseId(List<Tracking> trackingList, Long exerciseID) {
        for (Tracking tracking : trackingList) {
            if (tracking.getExercise().getId().equals(exerciseID)) {
                return Optional.of(tracking);
            }
        }
        return Optional.empty();
    }
}
