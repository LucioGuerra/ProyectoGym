package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.service.AppointmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        return appointmentService.getAppointmentById(id);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentByDate(@PathVariable LocalDate date) {
        return appointmentService.getAppointmentByDate(date);
    }

    //@PreAuthorize("ADMIN")
    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

    //@PreAuthorize("ADMIN")
    @DeleteMapping
    public ResponseEntity<?> deleteAppointment(@RequestBody Long id) {
        return appointmentService.deleteAppointment(id);
    }

    @PutMapping
    public ResponseEntity<?> updateAllAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.updateAllAppointment(appointmentDTO);
    }

    @PatchMapping
    public ResponseEntity<?> updateAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.updateAppointment(appointmentDTO);
    }
}


