package com.desarrollo.criminal.entity.routine;

import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.exercise.Exercise;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Entity
@Table(name = "activity_routine")
public class ActivityRoutine extends Routine{
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @OneToMany
    private List<Exercise> exercises;
}
