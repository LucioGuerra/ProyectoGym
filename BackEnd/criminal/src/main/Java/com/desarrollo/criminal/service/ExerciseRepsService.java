package com.desarrollo.criminal.service;

import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseRepsService {
    private ModelMapper modelMapper;

    public List<ExerciseReps> convertToEntity(List<ExercisesGroupDTO> blocks) {
        return blocks.stream().map(block -> modelMapper.map(block, ExerciseReps.class)).toList();
    }
}
