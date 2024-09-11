package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.repository.AppointmentRepository;
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

    public ResponseEntity<Appointment> getAppointmentById(Long appointmentId) {
        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
        return ResponseEntity.status(HttpStatus.OK).body(appointment.orElse(null));
    }

    public ResponseEntity<List<Appointment>> getAppointmentByDate(LocalDate date) {
        List<Appointment> appointment = appointmentRepository.findByDate(date);
        return ResponseEntity.status(HttpStatus.OK).body(appointment);
    }

    public ResponseEntity<AppointmentDTO> createAppointment(AppointmentDTO appointmentDTO) {

        Appointment appointment = new Appointment();
        appointment.setDate(appointmentDTO.getDate());
        appointment.setActivity(appointmentDTO.getActivity());
        appointment.setInstructor(appointmentDTO.getInstructor());
        appointment.setStartTime(appointmentDTO.getStartTime());
        appointment.setEndTime(appointmentDTO.getEndTime());
        appointment.setCreatedAt(LocalDate.now().atStartOfDay());

        appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<?> deleteAppointment(Long id) {

        appointmentRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> updateAllAppointment(AppointmentDTO appointmentDTO) {

        Appointment appointment = new Appointment();
        appointment.setDate(appointmentDTO.getDate());
        appointment.setActivity(appointmentDTO.getActivity());
        appointment.setInstructor(appointmentDTO.getInstructor());
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
