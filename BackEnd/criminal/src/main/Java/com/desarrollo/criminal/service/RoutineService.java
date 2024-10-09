package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExercisesGroupDTO;
import com.desarrollo.criminal.dto.request.RoutineDTO;
import com.desarrollo.criminal.entity.exercise.ExercisesGroup;
import com.desarrollo.criminal.entity.routine.ActivityRoutine;
import com.desarrollo.criminal.entity.routine.BuildingRoutine;
import com.desarrollo.criminal.entity.routine.RoutineType;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.repository.RoutineRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class RoutineService {
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final ActivityService activityService;
    private final ExercisesGroupService exercisesGroupService;
    private final RoutineRepository routineRepository;

    public ResponseEntity<List<Routine>> getAllRoutines() {
        List<Routine> routines = routineRepository.findAll();
        return ResponseEntity.ok(routines);
    }

    public ResponseEntity<Routine> getRoutineById(Long id) {
        Optional<Routine> routine = routineRepository.findById(id);
        return routine.map(value -> ResponseEntity.status(HttpStatus.OK).body(value)).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    public ResponseEntity<Routine> createRoutine(RoutineDTO routineDTO) {
        if (routineDTO.getRoutineType().equals(RoutineType.ACTIVITY)) {
            createActivityRoutine(routineDTO);
        } else {
            createBuildingRoutine(routineDTO);
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private void createActivityRoutine(RoutineDTO routineDTO) {
        ActivityRoutine activityRoutine = new ActivityRoutine();
        activityRoutine.setActivity(activityService.getActivityById(routineDTO.getActivityID()).getBody());

        assignBlocksToRoutine(activityRoutine, routineDTO);

        routineRepository.save(activityRoutine);
    }

    private void createBuildingRoutine(RoutineDTO routineDTO) {
        BuildingRoutine buildingRoutine = new BuildingRoutine(userService.getUserById(routineDTO.getUserID()).getBody(), routineDTO.getDay());

        assignBlocksToRoutine(buildingRoutine, routineDTO);

        routineRepository.save(buildingRoutine);
    }

    private void assignBlocksToRoutine(Routine routine, RoutineDTO routineDTO) {
        List<ExercisesGroup> blocks = new ArrayList<>();

        for (ExercisesGroupDTO block : routineDTO.getBlocks()) {
            ExercisesGroup persistedGroup = exercisesGroupService.createExercisesGroup(block);
            blocks.add(persistedGroup);
        }
        routine.setBlocks(blocks);
    }

    //public ResponseEntity<Routine> updateRoutine(Long ignoredId, Routine ignoredRoutine) {}
}