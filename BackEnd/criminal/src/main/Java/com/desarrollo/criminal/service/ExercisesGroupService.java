package com.desarrollo.criminal.service;

import com.desarrollo.criminal.repository.ExercisesGroupRepository;
import com.desarrollo.criminal.dto.request.ExerciseRepsDTO;
import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import com.desarrollo.criminal.entity.exercise.ExercisesGroup;

import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public final class ExercisesGroupService {
    private final ModelMapper modelMapper;
    private final ExerciseRepsService exerciseRepsService;
    private final ExercisesGroupRepository exercisesGroupRepository;

    public ExercisesGroup createExercisesGroup( ExercisesGroupDTO exercisesGroupDTO) {
        ExercisesGroup exercisesGroup = new ExercisesGroup(exercisesGroupDTO.getTitle(), exercisesGroupDTO.getDuration());
        List<ExerciseReps> persistedReps = new ArrayList<>();

        for (ExerciseRepsDTO exercise : exercisesGroupDTO.getExercises()) {
            ExerciseReps persistedRep = exerciseRepsService.createExerciseReps(exercise);
            persistedReps.add(persistedRep);
        }
        exercisesGroup.setExercises(persistedReps);

        return exercisesGroupRepository.save(exercisesGroup);
    }
}
