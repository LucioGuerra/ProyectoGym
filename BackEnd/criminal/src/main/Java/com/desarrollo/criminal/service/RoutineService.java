package com.desarrollo.criminal.service;
import com.desarrollo.criminal.dto.request.RoutineDTO;
import com.desarrollo.criminal.entity.routine.ActivityRoutine;
import com.desarrollo.criminal.entity.routine.BuildingRoutine;
import com.desarrollo.criminal.entity.routine.RoutineType;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.repository.RoutineRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class RoutineService {
    private final RoutineRepository RoutineRepository;
    private final RoutineRepository routineRepository;

    public ResponseEntity<List<Routine>> getAllRoutines() {
        List<Routine> routines = RoutineRepository.findAll();
        return ResponseEntity.ok(routines);
    }

    public ResponseEntity<Optional<Routine>> getRoutineById(Long id) {
        Optional<Routine> routine = RoutineRepository.findById(id);
        if (routine.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(routine);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<Routine> createRoutine(RoutineDTO routineDTO) {
        if (routineDTO.getRoutineType().equals(RoutineType.ACTIVITY)) {
            ActivityRoutine activityRoutine;
            activityRoutine = new ActivityRoutine();
            activityRoutine.setActivity(routineDTO.getActivity());
            commonAttributes(activityRoutine, routineDTO);

            routineRepository.save(activityRoutine);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            BuildingRoutine buildingRoutine;
            buildingRoutine = new BuildingRoutine();
            buildingRoutine.setUser(routineDTO.getUser());
            buildingRoutine.setDay(routineDTO.getDay());
            commonAttributes(buildingRoutine, routineDTO);

            routineRepository.save(buildingRoutine);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
    }

    private static void commonAttributes(Routine routine, RoutineDTO routineDTO) {
        routine.setBlocks(routineDTO.getBlocks());
    }

    public ResponseEntity<Routine> updateRoutine(Long ignoredId, Routine ignoredRoutine) {
        return null;
    }
}