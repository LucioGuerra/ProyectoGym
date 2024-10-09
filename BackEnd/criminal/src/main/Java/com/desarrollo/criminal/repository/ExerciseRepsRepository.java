package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desarrollo.criminal.entity.exercise.ExerciseReps;

import java.time.Duration;
import java.util.Optional;

public interface ExerciseRepsRepository extends JpaRepository<ExerciseReps, Long> {
    public Optional<ExerciseReps> findByDurationAndExerciseId(Duration duration, long exerciseID);
    public Optional<ExerciseReps> findBySeriesAndRepsAndExerciseId(Integer series, Integer reps, long exerciseID);
}
