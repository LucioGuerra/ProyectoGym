package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;

@Getter
@Setter
public class ExerciseRepsDTO {
    @NotBlank(message = "Exercise ID cannot be blank.")
    private Long exerciseID;

    @Digits(integer = 3, message = "Series must have a maximum of 3 integer digits.", fraction = 0)
    @PositiveOrZero(message = "Series cannot be negative.")
    private Integer series;

    @Digits(integer = 3, message = "Reps must have a maximum of 3 integer digits.", fraction = 0)
    @PositiveOrZero(message = "Reps cannot be negative.")
    private Integer reps;

    @PositiveOrZero(message = "Duration cannot be negative.")
    private Duration duration;
}
