package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import com.desarrollo.criminal.entity.exercise.ExercisesGroup;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;

import java.util.List;

@AllArgsConstructor
@Service
public final class ExercisesGroupService {
    public static List<ExercisesGroup> convertToEntity ( List<ExercisesGroupDTO> blocks ) {
        ModelMapper modelMapper = new ModelMapper();
        return blocks.stream().map(block -> modelMapper.map(block, ExercisesGroup.class)).toList();
    }
}
