package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.dto.request.UpdatePATCHAppointmentDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.exception.CriminalCrossException;
import com.desarrollo.criminal.repository.ActivityRepository;
import com.desarrollo.criminal.repository.AppointmentRepository;
import com.desarrollo.criminal.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ActivityService activityService;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId).orElseThrow(EntityNotFoundException::new);
    }

    public ResponseEntity<List<Appointment>> getAppointmentByDate(LocalDate date) {
        List<Appointment> appointment = appointmentRepository.findByDate(date);
        return ResponseEntity.status(HttpStatus.OK).body(appointment);
    }

    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointment = appointmentRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(appointment);
    }

    public ResponseEntity<?> createAppointment(AppointmentDTO appointmentDTO) {

        if(appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }

        //el modelmapper me da error
        // Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);
        Appointment appointment = new Appointment();
        appointment.setDate(appointmentDTO.getDate());
        appointment.setStartTime(appointmentDTO.getStartTime());
        appointment.setEndTime(appointmentDTO.getEndTime());

        Activity activity = activityRepository.findById(appointmentDTO.getActivityID())
                .orElseThrow(EntityNotFoundException::new);
        appointment.setActivity(activity);

        if (appointmentDTO.getInstructorID() != null) {
            User instructor = userRepository.findById(appointmentDTO.getInstructorID())
                    .orElseThrow(EntityNotFoundException::new);
            appointment.setInstructor(instructor);
        }

        appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<?> deleteAppointment(Long id) {
        try {
            Appointment appointment = this.getAppointmentById(id);
            appointment.setDeleted(true);
            appointmentRepository.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> updateAllAppointment(Long id, AppointmentDTO appointmentDTO) {

        if(appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("The start time must be before the end time");
        }
        try {
            Appointment appointment = this.getAppointmentById(id);

            //modelMapper.map(appointmentDTO, appointment);

            appointment.setDate(appointmentDTO.getDate());
            appointment.setStartTime(appointmentDTO.getStartTime());
            appointment.setEndTime(appointmentDTO.getEndTime());

            Activity activity = activityRepository.findById(appointmentDTO.getActivityID())
                    .orElseThrow(EntityNotFoundException::new);
            appointment.setActivity(activity);

            if (appointmentDTO.getInstructorID() != null) {
                User instructor = userRepository.findById(appointmentDTO.getInstructorID())
                        .orElseThrow(EntityNotFoundException::new);
                appointment.setInstructor(instructor);
            }


            appointmentRepository.save(appointment);

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> updateAppointment(Long id, UpdatePATCHAppointmentDTO updateAppointmentDTO) {
        try {
            Appointment appointment = this.getAppointmentById(id);
            // modelMapper.map(updateAppointmentDTO, appointment);

            if (updateAppointmentDTO.getDate() != null) {
                appointment.setDate(updateAppointmentDTO.getDate());
            }

            if (updateAppointmentDTO.getStartTime() != null) {
                appointment.setStartTime(updateAppointmentDTO.getStartTime());
            }

            if (updateAppointmentDTO.getEndTime() != null) {
                appointment.setEndTime(updateAppointmentDTO.getEndTime());
            }

            if (updateAppointmentDTO.getActivityID() != null) {
                Activity activity = activityRepository.findById(updateAppointmentDTO.getActivityID())
                        .orElseThrow(EntityNotFoundException::new);
                appointment.setActivity(activity);
            }

            if (updateAppointmentDTO.getInstructorID() != null) {
                User instructor = userRepository.findById(updateAppointmentDTO.getInstructorID())
                        .orElseThrow(EntityNotFoundException::new);
                appointment.setInstructor(instructor);
            }

            appointmentRepository.save(appointment);

            return ResponseEntity.status(HttpStatus.OK).build();

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
