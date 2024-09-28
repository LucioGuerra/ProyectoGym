package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.exercise.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ExerciseDTO {
    @NotBlank(message = "Exercise name cannot be empty.")
    @Size(min = 1, max = 20, message = "Exercise name must be between 1 and 20 characters.")
    private String name;

    @Size(max = 150, message = "Exercise description must have a maximum of 100 characters.")
    private String description;

    private MuscleGroup muscleGroup;
}
