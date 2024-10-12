package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.dto.request.UpdatePATCHAppointmentDTO;
import com.desarrollo.criminal.dto.response.AppointmentListResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentResponseDTO;
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
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getResponseAppointmentById(id);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentListResponseDTO>> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AppointmentListResponseDTO>> getAppointmentByDate(@PathVariable LocalDate date) {
        return appointmentService.getAppointmentByDate(date);
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}/deleteAllFutureAppointments={deleteAllFutureAppointments}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id, @PathVariable Boolean deleteAllFutureAppointments) {
        return appointmentService.deleteAppointment(id, deleteAllFutureAppointments);
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAllAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.updateAllAppointment(id, appointmentDTO);
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id,
                                               @RequestBody UpdatePATCHAppointmentDTO updateAppointmentDTO) {
        return appointmentService.updateAppointment(id, updateAppointmentDTO);
    }

    @PostMapping("/{appointmentId}/user/{userId}")
    public ResponseEntity<?> addParticipant(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.addParticipant(appointmentId, userId);
    }

    @PostMapping("/{appointmentId}/user/{userId}/attendance")
    public ResponseEntity<?> switchParticipantAttendance(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.switchParticipantAttendance(appointmentId, userId);
    }

    @DeleteMapping("/{appointmentId}/user/{userId}")
    public ResponseEntity<?> removeParticipant(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.removeParticipant(appointmentId, userId);
    }

}


