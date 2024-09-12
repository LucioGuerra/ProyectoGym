package com.desarrollo.criminal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desarrollo.criminal.service.ExerciseService;
import com.desarrollo.criminal.entity.exercise.Exercise;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController{
    private final ExerciseService exerciseService;

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise){
        return exerciseService.createExercise(exercise);
    }

    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises(){
        return exerciseService.getAllExercise();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@RequestParam Long id){
        return exerciseService.getExerciseById(id);
    }

    @PutMapping
    public ResponseEntity<Exercise> updateExercise(@RequestParam Long id, @RequestBody Exercise exercise){
        return exerciseService.updateExercise(id, exercise);
    }

    @DeleteMapping
    public ResponseEntity<Exercise> deleteExercise(@RequestParam Long id){
        return exerciseService.deleteExercise(id);
    }
}
