package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExerciseRepsDTO;
import com.desarrollo.criminal.entity.exercise.Exercise;
import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import com.desarrollo.criminal.repository.ExerciseRepsRepository;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ExerciseRepsService {
    private final ExerciseRepsRepository exerciseRepsRepository;
    private final ExerciseService exerciseService;

    public void createExerciseReps(ExerciseRepsDTO exerciseRepsDTO) {
        Exercise exercise = exerciseService.getExerciseById(exerciseRepsDTO.getExerciseID()).getBody();
        if (Optional.ofNullable(exerciseRepsDTO.getDuration()).isPresent()) {
            if (exerciseRepsRepository.findByDurationAndExerciseId(exerciseRepsDTO.getDuration(), exerciseRepsDTO.getExerciseID()).isPresent ()) {
                ExerciseReps exerciseReps = new ExerciseReps(exerciseRepsDTO.getDuration(), exercise);
                exerciseRepsRepository.save(exerciseReps);
            }
        } else if (exerciseRepsRepository.findBySeriesAndRepsAndExerciseId(exerciseRepsDTO.getSeries(), exerciseRepsDTO.getReps(), exerciseRepsDTO.getExerciseID()).isPresent ()) {
            ExerciseReps exerciseReps = new ExerciseReps(exerciseRepsDTO.getReps(), exerciseRepsDTO.getSeries(), exercise);
            exerciseRepsRepository.save(exerciseReps);
        }
    }
}
