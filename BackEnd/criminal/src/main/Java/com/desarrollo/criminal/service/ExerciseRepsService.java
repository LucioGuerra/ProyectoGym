package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import org.modelmapper.ModelMapper;

import java.util.List;

public class ExerciseRepsService {
    public static List<ExerciseRepsService> convertToEntity ( List<ExercisesGroupDTO> blocks ) {
        ModelMapper modelMapper = new ModelMapper();
        return blocks.stream().map(block -> modelMapper.map(block, ExerciseRepsService.class)).toList();
    }
}
