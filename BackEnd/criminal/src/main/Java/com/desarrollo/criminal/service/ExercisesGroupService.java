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

    public List<ExercisesGroup> convertToEntity(List<ExercisesGroupDTO> blocks) {
        return blocks.stream().map(block -> modelMapper.map(block, ExercisesGroup.class)).toList();
    }
}
