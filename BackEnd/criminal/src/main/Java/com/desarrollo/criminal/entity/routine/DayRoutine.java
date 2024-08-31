package com.desarrollo.criminal.entity.routine;

import com.desarrollo.criminal.entity.exercise.Exercise;
import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
public class DayRoutine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    private Routine routine;

    @OneToMany
    private List<ExerciseReps> exercises;

    private Day day;

    private void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
