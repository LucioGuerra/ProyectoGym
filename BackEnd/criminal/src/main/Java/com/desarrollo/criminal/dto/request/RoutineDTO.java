package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.routine.Day;
import com.desarrollo.criminal.entity.routine.RoutineType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import  java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class RoutineDTO {
    private ActivityDTO activity;
    private long userID;
    private Day day;
    private List<ExercisesGroupDTO> blocks;
    private RoutineType routineType;
}