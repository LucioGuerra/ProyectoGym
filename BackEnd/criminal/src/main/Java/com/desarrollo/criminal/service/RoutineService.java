package com.desarrollo.criminal.service;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.repository.RoutineRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class RoutineService {
    private final RoutineRepository RoutineRepository;

    public List<Routine> getAllRoutines() {
        return RoutineRepository.findAll();
    }

    public Optional<Routine> getRoutineById(Long id) {
        return RoutineRepository.findById(id);
    }

    public Routine createRoutine(Routine Routine) {
        return RoutineRepository.save(Routine);
    }
}