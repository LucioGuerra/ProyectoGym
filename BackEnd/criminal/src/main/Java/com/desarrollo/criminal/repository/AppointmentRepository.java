package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);

    List<Appointment> findByDateAndActivity_NameNotAndDeletedFalseOrderByStartTime(LocalDate date, String activityName);

    @Query("SELECT a FROM Appointment a WHERE a.date = :date AND a.activity.name = :activityName AND a.deleted = false ORDER BY a.startTime")
    List<Appointment> findByDateAndActivity_NameAndDeletedFalseOrderByStartTime(LocalDate date, String activityName);

    List<Appointment> findByRecurrenceIdAndDateGreaterThan(Long recurrenceId, LocalDate date);

    List<Appointment> findByRecurrenceIdAndDateGreaterThanEqual(Long recurrenceId, LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.date = :date AND a.startTime = :startTime AND :user MEMBER OF a.participants")
    Optional<Appointment> findAppointmentByDateAndStartTimeAndParticipantsContains(LocalDate date, LocalTime startTime, User user);
}
