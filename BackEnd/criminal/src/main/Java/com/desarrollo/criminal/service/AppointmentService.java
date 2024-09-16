package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.exception.CriminalCrossException;
import com.desarrollo.criminal.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ActivityService activityService;
    private final UserService userService;

    public ResponseEntity<Appointment> getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(EntityNotFoundException::new);
        return ResponseEntity.status(HttpStatus.OK).body(appointment);
    }

    public ResponseEntity<List<Appointment>> getAppointmentByDate(LocalDate date) {
        List<Appointment> appointment = appointmentRepository.findByDate(date);
        return ResponseEntity.status(HttpStatus.OK).body(appointment);
    }

    public ResponseEntity<?> createAppointment(AppointmentDTO appointmentDTO) {

        if(appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }

        Appointment appointment = new Appointment();
        appointment.setActivity(activityService.getActivityById(appointmentDTO.getActivityID()));
        appointment.setInstructor(userService.getUserById(appointmentDTO.getInstructorID()));
        appointment.setStartTime(appointmentDTO.getStartTime());
        appointment.setEndTime(appointmentDTO.getEndTime());
        appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<?> deleteAppointment(Long id) {

        appointmentRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> updateAllAppointment(AppointmentDTO appointmentDTO) {

        if(appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("The start time must be before the end time");
        }

        Appointment appointment = new Appointment();
        appointment.setActivity(activityService.getActivityById(appointmentDTO.getActivityID()));
        appointment.setInstructor(userService.getUserById(appointmentDTO.getInstructorID()));
        appointment.setStartTime(appointmentDTO.getStartTime());
        appointment.setEndTime(appointmentDTO.getEndTime());
        appointment.setCreatedAt(LocalDate.now().atStartOfDay());

        appointmentRepository.save(appointment);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> updateAppointment(AppointmentDTO appointmentDTO) {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
