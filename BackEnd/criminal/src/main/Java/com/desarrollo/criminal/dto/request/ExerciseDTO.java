package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.exercise.MuscleGroup;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseDTO {

    @Column(nullable = false, length = 30)
    private String name;

    @Column(length = 150)
    private String description;

    private MuscleGroup muscleGroup;
}
