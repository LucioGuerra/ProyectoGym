package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Duration;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class ExercisesGroupDTO {
    @NotBlank(message = "Title cannot be blank.")
    @Size(min = 1, max = 50, message = "Title must be between 1 and 50 characters.")
    private String title;

    @NotEmpty(message = "ExercisesReps cannot be empty.")
    private List<ExerciseRepsDTO> exercises;

    @Positive(message = "Duration cannot be negative.")
    private Duration duration;
}