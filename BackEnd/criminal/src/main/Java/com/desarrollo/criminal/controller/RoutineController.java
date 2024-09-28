package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.RoutineDTO;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.service.RoutineService;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/routines")
public class RoutineController {
    private final RoutineService routineService;

    @GetMapping
    public ResponseEntity<List<Routine>> getAllRoutines() {
        return routineService.getAllRoutines();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Routine>> getRoutineById(@PathVariable Long id) {
        return routineService.getRoutineById(id);
    }

    @PostMapping
    public ResponseEntity<Routine> createRoutine(@RequestBody RoutineDTO routineDTO) {
        return routineService.createRoutine(routineDTO);
    }

//    @PutMapping("/id")
//    public ResponseEntity<Routine> updateRoutine(@PathVariable Long id, @RequestBody Routine routine) {
//        return routineService.updateRoutine(id,routine);
//    }
}