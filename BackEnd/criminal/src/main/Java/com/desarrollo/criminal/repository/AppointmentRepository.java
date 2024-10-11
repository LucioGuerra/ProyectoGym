package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);

    List<Appointment> findByDateAndDeletedFalseOrderByStartTime(LocalDate date);

    List<Appointment> findByRecurrenceIdAndDateGreaterThan(Long recurrenceId, LocalDate date);

    List<Appointment> findByRecurrenceIdAndDateGreaterThanEqual(Long recurrenceId, LocalDate date);
}
