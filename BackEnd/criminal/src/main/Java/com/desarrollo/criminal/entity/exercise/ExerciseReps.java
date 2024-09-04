package com.desarrollo.criminal.entity.exercise;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class ExerciseReps {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false)
    private Integer series;

    @Column(nullable = false)
    private Integer reps;

    private ExerciseReps() {}
}
