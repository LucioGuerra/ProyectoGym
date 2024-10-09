package com.desarrollo.criminal.service;

import com.desarrollo.criminal.repository.ExercisesGroupRepository;
import com.desarrollo.criminal.dto.request.ExerciseRepsDTO;
import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import com.desarrollo.criminal.entity.exercise.ExercisesGroup;

import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public final class ExercisesGroupService {
    private final ModelMapper modelMapper;
    private final ExerciseRepsService exerciseRepsService;
    private final ExercisesGroupRepository exercisesGroupRepository;

    public void createExercisesGroup(ExercisesGroupDTO exercisesGroupDTO) {
        ExercisesGroup exercisesGroup = new ExercisesGroup(exercisesGroupDTO.getTitle(), exercisesGroupDTO.getDuration());
        for (ExerciseRepsDTO exercise : exercisesGroupDTO.getExercises()) {
            exerciseRepsService.createExerciseReps(exercise);
        }
        exercisesGroup.setExercises(exercisesGroupDTO.getExercises().stream().map(block -> modelMapper.map(block, ExerciseReps.class)).toList());

        exercisesGroupRepository.save(exercisesGroup);
    }
}
