package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.exception.CriminalCrossException;
import com.desarrollo.criminal.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final ModelMapper modelMapper;

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

        //Todo: Create ModelMapper configuration to use here
        Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);

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

        Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);

        appointmentRepository.save(appointment);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> updateAppointment(AppointmentDTO appointmentDTO) {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
