package com.desarrollo.criminal.entity.exercise;

import com.desarrollo.criminal.entity.routine.Routine;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
public class ExercisesGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /*@ManyToOne
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;
     */

    @ManyToMany
    private List<ExerciseReps> exercises;

    private Duration duration;

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public ExercisesGroup() {}

    public ExercisesGroup(String title, Duration duration) {
        this.title = title;
        this.duration = duration;
    }
}
