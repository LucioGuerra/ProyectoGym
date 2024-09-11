package com.desarrollo.criminal.service;
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

    public Routine createRoutine(Routine Routine) {
        return RoutineRepository.save(Routine);
    }

    public ResponseEntity<Routine> updateRoutine(Long ignoredId, Routine ignoredRoutine) {
        return null;
    }
}