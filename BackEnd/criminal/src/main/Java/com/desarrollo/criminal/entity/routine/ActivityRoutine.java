package com.desarrollo.criminal.entity.routine;

import com.desarrollo.criminal.entity.Activity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "activity_routine")
public class ActivityRoutine extends Routine{
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    public ActivityRoutine(){

    }
}