package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExerciseRepsDTO;
import com.desarrollo.criminal.entity.exercise.ExerciseReps;
import com.desarrollo.criminal.repository.ExerciseRepsRepository;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ExerciseRepsService {
    private final ModelMapper modelMapper;
    private final ExerciseRepsRepository exerciseRepsRepository;

    public void createExerciseReps(ExerciseRepsDTO exerciseRepsDTO) {
        ExerciseReps exerciseReps = new ExerciseReps();

        if (exerciseRepsDTO.getDuration() != null) {
            if (!existsExerciseRepsDuration(exerciseRepsDTO)) {
                generateNewExerciseWithDuration(exerciseRepsDTO, exerciseReps);

                exerciseRepsRepository.save(exerciseReps);
            }
        } else if (!existsExerciseRepsWithSeries(exerciseRepsDTO)) {
            generateNewExerciseReps(exerciseRepsDTO, exerciseReps);

            exerciseRepsRepository.save(exerciseReps);
        }
    }

    public boolean existsExerciseRepsDuration(ExerciseRepsDTO exerciseRepsDTO) {
        Optional<ExerciseReps> exerciseReps = exerciseRepsRepository.findByDurationAndExerciseId(exerciseRepsDTO.getDuration(), exerciseRepsDTO.getExerciseID());
        return exerciseReps.isPresent();
    }

    public void generateNewExerciseReps(ExerciseRepsDTO exerciseRepsDTO, ExerciseReps exerciseReps) {
        exerciseReps.setSeries(exerciseRepsDTO.getSeries());
        exerciseReps.setReps(exerciseRepsDTO.getReps());
    }

    public boolean existsExerciseRepsWithSeries(ExerciseRepsDTO exerciseRepsDTO) {
        Optional<ExerciseReps> exerciseReps = exerciseRepsRepository.findBySeriesAndRepsAndExerciseId(exerciseRepsDTO.getSeries(), exerciseRepsDTO.getReps(), exerciseRepsDTO.getExerciseID());
        return exerciseReps.isPresent();
    }

    public void generateNewExerciseWithDuration(ExerciseRepsDTO exerciseRepsDTO, ExerciseReps exerciseReps) {
        exerciseReps.setDuration(exerciseRepsDTO.getDuration());
        exerciseRepsRepository.save(exerciseReps);
    }

    public List<ExerciseReps> convertToEntity(List<ExerciseRepsDTO> blocks) {
        return blocks.stream().map(block -> modelMapper.map(block, ExerciseReps.class)).toList();
    }
}
