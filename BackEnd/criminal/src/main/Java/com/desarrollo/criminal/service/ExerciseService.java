package com.desarrollo.criminal.service;

import java.util.List;

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

    public ResponseEntity<Exercise> createExercise(Exercise exercise){
        Exercise savedExercise = exerciseRepository.save(exercise);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExercise);
    }

    public ResponseEntity<List<Exercise>> getAllExercise(){
        List<Exercise> exercises = exerciseRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(exercises);
    }

    public Exercise getExerciseById(Long id){
        Exercise exercise = exerciseRepository.findById(id).get();
        return exercise;
    }

    public ResponseEntity<Exercise> updateExercise(Long id, Exercise exercise){
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<Exercise> deleteExercise(Long id){
        exerciseRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
