package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.dto.request.UpdateAppointmentDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.service.AppointmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/public/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            return ResponseEntity.status(HttpStatus.OK).body(appointment);
        }catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentByDate(@PathVariable LocalDate date) {
        return appointmentService.getAppointmentByDate(date);
    }

    /*@PreAuthorize("hasRole('ROLE_ADMIN')")*/
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

    /*@PreAuthorize("hasRole('ROLE_ADMIN')")*/
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        return appointmentService.deleteAppointment(id);
    }

    /*@PreAuthorize("hasRole('ROLE_ADMIN')")*/
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAllAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.updateAllAppointment(id, appointmentDTO);
    }

    /*@PreAuthorize("hasRole('ROLE_ADMIN')")*/
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id,
                                               @RequestBody UpdateAppointmentDTO updateAppointmentDTO) {
        return appointmentService.updateAppointment(id, updateAppointmentDTO);
    }
}


