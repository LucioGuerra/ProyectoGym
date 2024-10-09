package com.desarrollo.criminal.entity.exercise;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;

@Setter
@Getter
@Entity
@AllArgsConstructor
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

    public ExerciseReps() {

    }

    public ExerciseReps(Integer series, Integer reps, Exercise exercise) {
        this.series = series;
        this.reps = reps;
        this.exercise = exercise;
    }

    public ExerciseReps(Duration duration, Exercise exercise) {
        this.duration = duration;
        this.exercise = exercise;
    }
}
