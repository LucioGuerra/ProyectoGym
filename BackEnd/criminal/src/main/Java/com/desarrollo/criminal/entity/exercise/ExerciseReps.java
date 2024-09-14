package com.desarrollo.criminal.entity.exercise;

import com.desarrollo.criminal.entity.routine.ExercisesGroup;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Getter
@Entity
public class ExerciseReps {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private Integer series;

    private Integer reps;

    private Duration duration;

    private ExerciseReps() {}
}
