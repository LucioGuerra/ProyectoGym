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

    public ExerciseReps createExerciseReps(ExerciseRepsDTO exerciseRepsDTO) {
        Exercise exercise = exerciseService.getExerciseById(exerciseRepsDTO.getExerciseID()).getBody();

        if (Optional.ofNullable(exerciseRepsDTO.getDuration()).isPresent()) {
            return exerciseRepsRepository.findByDurationAndExerciseId(exerciseRepsDTO.getDuration(), exerciseRepsDTO.getExerciseID()).orElseGet(() -> {
                ExerciseReps exerciseReps = new ExerciseReps(exerciseRepsDTO.getDuration(), exercise);
                return exerciseRepsRepository.save(exerciseReps);
            });
        } else {
            return exerciseRepsRepository.findBySeriesAndRepsAndExerciseId(exerciseRepsDTO.getSeries(), exerciseRepsDTO.getReps(), exerciseRepsDTO.getExerciseID()).orElseGet(() -> {
                ExerciseReps exerciseReps = new ExerciseReps(exerciseRepsDTO.getReps(), exerciseRepsDTO.getSeries(), exercise);
                return exerciseRepsRepository.save(exerciseReps);
            });
        }
    }
}
