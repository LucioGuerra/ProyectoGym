package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desarrollo.criminal.entity.exercise.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, Long>{

}
