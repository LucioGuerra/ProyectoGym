package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import com.desarrollo.criminal.entity.exercise.ExercisesGroup;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Service
public final class ExercisesGroupService {
    private final ModelMapper modelMapper;
    private final ExerciseRepsService exerciseRepsService;

    public void createExercisesGroup(ExercisesGroupDTO exercisesGroupDTO) {
        ExercisesGroup exercisesGroup = new ExercisesGroup();

        exercisesGroup.setTitle(exercisesGroupDTO.getTitle());
        exercisesGroup.setDuration(exercisesGroupDTO.getDuration());
        for (var exercise : exercisesGroupDTO.getExercises()) {
            exerciseRepsService.createExerciseReps(exercise);
        }
        exercisesGroup.setExercises(exerciseRepsService.convertToEntity(exercisesGroupDTO.getExercises()));
    }
}
