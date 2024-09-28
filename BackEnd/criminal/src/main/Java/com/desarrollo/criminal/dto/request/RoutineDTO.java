package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.routine.Day;
import com.desarrollo.criminal.entity.routine.RoutineType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class RoutineDTO {
    private ActivityDTO activity;

    private long userID;

    private Day day;

    @NotEmpty(message = "Routine blocks cannot be empty.")
    private List<ExercisesGroupDTO> blocks;

    @NotNull(message = "Routine type cannot be null.")
    private RoutineType routineType;
}