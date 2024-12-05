package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.dto.request.KinesiologyAppointmentDTO;
import com.desarrollo.criminal.dto.request.UpdatePATCHAppointmentDTO;
import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.response.AppointmentListResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentResponseDTO;
import com.desarrollo.criminal.dto.response.GetAppointmentKineDTO;
import com.desarrollo.criminal.service.AppointmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/appointments")
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

    @PostMapping("/admin")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

    @GetMapping("/public/kine/date/{date}")
    public ResponseEntity<List<AppointmentListResponseDTO>> getKinesiologyAppointmentByDate(@PathVariable LocalDate date) {
        return appointmentService.getKinesiologyAppointmentByDate(date);
    }

    @PostMapping("/public/kine")
    public ResponseEntity<?> createKinesiologyAppointment(@RequestBody KinesiologyAppointmentDTO kinesiologyAppointmentDTO) {
        return appointmentService.createKinesiologyAppointment(kinesiologyAppointmentDTO);
    }

    @DeleteMapping("/admin/{id}/deleteAllFutureAppointments={deleteAllFutureAppointments}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id,
                                                @PathVariable Boolean deleteAllFutureAppointments) {
        return appointmentService.deleteAppointment(id, deleteAllFutureAppointments);
    }

    @PutMapping("admin/{id}")
    public ResponseEntity<?> updateAllAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.updateAllAppointment(id, appointmentDTO);
    }

    @PatchMapping("/public/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id,
                                               @RequestBody UpdatePATCHAppointmentDTO updateAppointmentDTO) {
        return appointmentService.updateAppointment(id, updateAppointmentDTO);
    }


    @PostMapping("/{appointmentId}/user/{userId}")
    public ResponseEntity<?> addParticipant(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.addParticipant(appointmentId, userId);
    }

    @PostMapping("/admin/{appointmentId}/user/{userId}/attendance")
    public ResponseEntity<?> switchParticipantAttendance(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.switchParticipantAttendance(appointmentId, userId);
    }

    @DeleteMapping("/{appointmentId}/user/{userId}")
    public ResponseEntity<?> removeParticipant(@PathVariable Long appointmentId, @PathVariable Long userId) {
        return appointmentService.removeParticipant(appointmentId, userId);
    }

    @GetMapping("/kine")
    public ResponseEntity<List<GetAppointmentKineDTO>> getAllKinesiologyAppointments(@RequestParam("dni") String dni) {
        return appointmentService.getKinesiologyAppointmentByDni(dni);
    }

    @PatchMapping("/kine/{id}/add")
    public ResponseEntity<?> addParticipantToKinesiology(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO) {
        return appointmentService.addParticipantToKinesiology(id, userRequestDTO);
    }


    @PatchMapping("/kine/{id}/remove")
    public ResponseEntity<?> removeParticipantFromKinesiology(@PathVariable Long id, @RequestParam("dni") String dni) {
        return appointmentService.removeParticipantFromKinesiology(id, dni);
    }

    @PostMapping("/kine/create")
    public ResponseEntity<?> createKinesiology(@RequestBody UserRequestDTO userRequestDTO) {
        return appointmentService.createKine(userRequestDTO);
    }

}


