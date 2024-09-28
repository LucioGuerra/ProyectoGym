package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.routine.Routine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutineRepository extends JpaRepository<Routine, Long> {

}