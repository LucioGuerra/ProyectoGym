package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);

    List<Appointment> findByDateAndActivity_NameNotAndDeletedFalseOrderByStartTime(LocalDate date, String activityName);

    @Query("SELECT a FROM Appointment a WHERE a.date = :date AND a.activity.name = :activityName AND a.deleted = false ORDER BY a.startTime")
    List<Appointment> findByDateAndActivity_NameAndDeletedFalseOrderByStartTime(LocalDate date, String activityName);

    List<Appointment> findByRecurrenceIdAndDateGreaterThan(Long recurrenceId, LocalDate date);

    List<Appointment> findByRecurrenceIdAndDateGreaterThanEqual(Long recurrenceId, LocalDate date);
}
