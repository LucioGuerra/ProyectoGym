package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);

    List<Appointment> findByDateAndDeletedFalse(LocalDate date);

    List<Appointment> findByRecurrenceIdAndDateGreaterThan(Long recurrenceId, LocalDate date);

    Optional<Appointment> findAppointmentByDateAndStartTimeAndParticipantsContains(LocalDate date, LocalTime startTime, User participant);

}
