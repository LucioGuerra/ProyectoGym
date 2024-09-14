package com.desarrollo.criminal.entity.routine;

import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
public class ExercisesGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;

    @ManyToMany
    private List<ExerciseReps> exercises;

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
