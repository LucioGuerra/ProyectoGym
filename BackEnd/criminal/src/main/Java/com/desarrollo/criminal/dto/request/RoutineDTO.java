package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.exercise.ExercisesGroup;
import com.desarrollo.criminal.entity.routine.Day;
import com.desarrollo.criminal.entity.routine.RoutineType;
import com.desarrollo.criminal.entity.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import  java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class RoutineDTO {
    private Activity activity;
    private User user;
    private Day day;
    private List<ExercisesGroup> blocks;
    private RoutineType routineType;
}