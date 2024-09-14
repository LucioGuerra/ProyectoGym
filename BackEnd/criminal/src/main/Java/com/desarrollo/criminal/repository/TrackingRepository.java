package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desarrollo.criminal.entity.tracking.Tracking;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TrackingRepository extends JpaRepository<Tracking, Long>{

    @Query("SELECT t FROM Tracking t JOIN User u WHERE u.id = ?1 AND t.exercise.id = ?2")
    Optional<Tracking> findTrackingByUserIDAndExerciseID(Long userID, Long exerciseID);

}
