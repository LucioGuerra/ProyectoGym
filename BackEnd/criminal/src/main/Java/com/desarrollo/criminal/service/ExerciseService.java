package com.desarrollo.criminal.service;

import java.util.List;
import java.util.Optional;

import com.desarrollo.criminal.dto.request.ExerciseDTO;
import com.desarrollo.criminal.entity.routine.Routine;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.desarrollo.criminal.repository.ExerciseRepository;
import com.desarrollo.criminal.entity.exercise.Exercise;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;

    public ResponseEntity<Exercise> createExercise( ExerciseDTO exerciseDTO){
        Exercise exercise = new Exercise(exerciseDTO.getName(), exerciseDTO.getDescription(), exerciseDTO.getMuscleGroup());

        exerciseRepository.save(exercise);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<List<Exercise>> getAllExercise(){
        List<Exercise> exercises = exerciseRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(exercises);
    }

    public ResponseEntity<Exercise> getExerciseById(Long id){
        Optional<Exercise> exercise = exerciseRepository.findById(id);
        return exercise.map(value -> ResponseEntity.status(HttpStatus.OK).body(value)).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    public ResponseEntity<Exercise> updateExercise(Long id, Exercise exercise){
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<Exercise> deleteExercise(Long id){
        exerciseRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
