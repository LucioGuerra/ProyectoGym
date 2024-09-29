package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.dto.request.UpdatePATCHAppointmentDTO;
import com.desarrollo.criminal.dto.response.AppointmentListResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentUserDTO;
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
        return appointmentRepository.findById(appointmentId).orElseThrow(() -> new EntityNotFoundException(
                "Appointment not found with id: " + appointmentId));
    }

    public ResponseEntity<List<AppointmentListResponseDTO>> getAppointmentByDate(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDate(date);
        return getListResponseEntity(appointments);
    }

    private ResponseEntity<List<AppointmentListResponseDTO>> getListResponseEntity(List<Appointment> appointments) {
        List<AppointmentListResponseDTO> responseAppointments = appointments.stream()
                .map(appointment -> {
                    AppointmentListResponseDTO responseAppointmentDTO = modelMapper.map(appointment, AppointmentListResponseDTO.class);
                    responseAppointmentDTO.setActivity(appointment.getActivity().getName());
                    return responseAppointmentDTO;
                })
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(responseAppointments);
    }

    public ResponseEntity<List<AppointmentListResponseDTO>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return getListResponseEntity(appointments);
    }

    public ResponseEntity<?> createAppointment(AppointmentDTO appointmentDTO) {

        if(appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }

        if (appointmentDTO.getEndDate() != null && appointmentDTO.getEndDate().isAfter(appointmentDTO.getDate())){
            throw new CriminalCrossException("INVALID_DATE_RANGE", "The end date must be after the start date");
        }

        //el modelmapper me da error
        // Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);
        Activity activity = activityRepository.findById(appointmentDTO.getActivityID())
                .orElseThrow(() -> new EntityNotFoundException("Activity not found with id: " + appointmentDTO.getActivityID()));

        User instructor = null; // el instructor es opcional asi que puede ser null, no te preocupes
        if(appointmentDTO.getInstructorID() != null) {
            instructor = userRepository.findById(appointmentDTO.getInstructorID())
                    .orElseThrow(() -> new EntityNotFoundException("Instructor not found with id: " + appointmentDTO.getInstructorID()));
        }

        if (appointmentDTO.getAppointmentWeekDays() != null && appointmentDTO.getEndDate() != null && !appointmentDTO.getAppointmentWeekDays().isEmpty()) {
            Long recurrenceId = null; //esto se usa para guardar el id de la primera cita que se crea, no se guarda como null

            LocalDate appointmentDate = appointmentDTO.getDate();

            while (appointmentDate.isBefore(appointmentDTO.getEndDate())) {
                if (appointmentDTO.getAppointmentWeekDays().contains(appointmentDate.getDayOfWeek())) {

                    Appointment appointment = new Appointment();
                    appointment.setDate(appointmentDate);
                    appointment.setStartTime(appointmentDTO.getStartTime());
                    appointment.setEndTime(appointmentDTO.getEndTime());
                    appointment.setActivity(activity);
                    appointment.setInstructor(instructor);

                    if (recurrenceId == null) {
                        appointment = appointmentRepository.save(appointment);
                        recurrenceId = appointment.getId(); // Get the generated ID
                        appointment.setRecurrenceId(recurrenceId); // Set recurrenceId to its own ID
                        appointmentRepository.save(appointment); // Update the appointment with recurrenceId
                    } else {
                        appointment.setRecurrenceId(recurrenceId); // Set recurrenceId for subsequent appointments
                        appointmentRepository.save(appointment);
                    }
                }
                appointmentDate = appointmentDate.plusDays(1);
            }
        } else {
            Appointment appointment = new Appointment();
            appointment.setDate(appointmentDTO.getDate());
            appointment.setStartTime(appointmentDTO.getStartTime());
            appointment.setEndTime(appointmentDTO.getEndTime());
            appointment.setActivity(activity);
            appointmentRepository.save(appointment);
        }
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

    public ResponseEntity<AppointmentResponseDTO> getResponseAppointmentById(Long id) {
        try {
            Appointment appointment = this.getAppointmentById(id);
            AppointmentResponseDTO responseAppointmentDTO = modelMapper.map(appointment, AppointmentResponseDTO.class);
            responseAppointmentDTO.setActivity(appointment.getActivity().getName());
            if(appointment.getInstructor() != null) {
                responseAppointmentDTO.setInstructor(appointment.getInstructor().getFirstName() + " " + appointment.getInstructor().getLastName());
            }
            return ResponseEntity.status(HttpStatus.OK).body(responseAppointmentDTO);
        }catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> addParticipant(Long appointmentId, Long userId) {
        try {
            Appointment appointment = this.getAppointmentById(appointmentId);
            User user = userService.getUserById(userId);
            appointment.getParticipants().add(user);
            appointmentRepository.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    public ResponseEntity<?> removeParticipant(Long appointmentId, Long userId) {
        try{
            Appointment appointment = this.getAppointmentById(appointmentId);
            User user = userService.getUserById(userId);
            if (!appointment.getParticipants().contains(user)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user is not registered in this appointment");
            }
            appointment.getParticipants().remove(user);
            appointmentRepository.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
        }
    }
}
