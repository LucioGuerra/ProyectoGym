package com.desarrollo.criminal.service;


import com.desarrollo.criminal.entity.tracking.DateWeight;
import com.desarrollo.criminal.entity.tracking.Tracking;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.repository.TrackingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;



@AllArgsConstructor
@Service
public class TrackingService {
    private final TrackingRepository trackingRepository;
    private final ExerciseService exerciseService;
    private final UserService userService;

    public Tracking createTrackingForUser(User user, long exerciseId){
        Tracking tracking = new Tracking();
        tracking.setExercise(exerciseService.getExerciseById(exerciseId));
        trackingRepository.save(tracking);
        user.addTracking(tracking);
        return tracking;
    }

    public void deleteTracking(Long id){
        trackingRepository.deleteById(id);
    }

    public void updateTracking(Long userId, Long exerciseId, DateWeight dateWeight){
        User user = userService.getUserById(userId);
        Tracking tracking = getTrackingOfUserByExerciseId(user, exerciseId);
        tracking.addDateWeight(dateWeight);
    }

    public Tracking getTrackingOfUserByExerciseId(User user, Long exerciseID) {
        for (Tracking tracking : user.getTrackings()) {
            if (tracking.getExercise().getId().equals(exerciseID)) {
                return tracking;
            }
        }
        return createTrackingForUser(user, exerciseID);
    }
}
