package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.AppointmentDTO;
import com.desarrollo.criminal.dto.request.KinesiologyAppointmentDTO;
import com.desarrollo.criminal.dto.request.UpdatePATCHAppointmentDTO;
import com.desarrollo.criminal.dto.response.AppointmentListResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentResponseDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.exception.CriminalCrossException;
import com.desarrollo.criminal.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@AllArgsConstructor
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ActivityService activityService;
    private final UserService userService;
    private final ModelMapper modelMapper;


    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId).orElseThrow(() -> new EntityNotFoundException(
                "Appointment not found with id: " + appointmentId));
    }

    public ResponseEntity<List<AppointmentListResponseDTO>> getAppointmentByDate(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDateAndDeletedFalseOrderByStartTime(date);
        return getListResponseEntity(appointments);
    }

    private ResponseEntity<List<AppointmentListResponseDTO>> getListResponseEntity(List<Appointment> appointments) {
        List<AppointmentListResponseDTO> responseAppointments = appointments.stream()
                .map(appointment -> {
                    AppointmentListResponseDTO responseAppointmentDTO = modelMapper.map(appointment, AppointmentListResponseDTO.class);
                    responseAppointmentDTO.setDate(appointment.getDate().atTime(appointment.getStartTime()));
                    responseAppointmentDTO.setActivity(appointment.getActivity().getName());
                    responseAppointmentDTO.setParticipantsCount(appointment.getParticipants().size());
                    return responseAppointmentDTO;
                })
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(responseAppointments);
    }

    public ResponseEntity<List<AppointmentListResponseDTO>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return getListResponseEntity(appointments);
    }

    @Transactional
    public ResponseEntity<?> createAppointment(AppointmentDTO appointmentDTO) {

        Integer appointmentsCreated = 0;

        if (appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }

        if (appointmentDTO.getDate().isAfter(appointmentDTO.getEndDate())) {
            throw new CriminalCrossException("INVALID_DATE_RANGE", "The end date must be after the start date");
        }

        Activity activity = activityService.getActivityById(appointmentDTO.getActivityID());

        Optional<User> instructorOptional = Optional.ofNullable(appointmentDTO.getInstructorID())
                .map(userService::getUserById);

        Appointment appointment = new Appointment();
        appointment.setDate(appointmentDTO.getDate());
        appointment.setStartTime(appointmentDTO.getStartTime());
        appointment.setEndTime(appointmentDTO.getEndTime());
        appointment.setActivity(activity);
        appointment.setMax_capacity(appointmentDTO.getMax_capacity());
        if (instructorOptional.isPresent()) {
            appointment.setInstructor(instructorOptional.get());
        }
        appointment = appointmentRepository.save(appointment);
        Long recurrenceId = appointment.getId();
        appointment.setRecurrenceId(recurrenceId);
        appointmentRepository.save(appointment);
        appointmentsCreated++;

        if (!appointmentDTO.getAppointmentWeekDays().isEmpty() && appointmentDTO.getEndDate().isAfter(appointmentDTO.getDate())) {

            LocalDate appointmentDate = appointmentDTO.getDate().plusDays(1);

            while (appointmentDate.isBefore(appointmentDTO.getEndDate().plusDays(1))) {
                if (appointmentDTO.getAppointmentWeekDays().contains(appointmentDate.getDayOfWeek())) {

                    appointment = new Appointment();
                    appointment.setDate(appointmentDate);
                    appointment.setStartTime(appointmentDTO.getStartTime());
                    appointment.setEndTime(appointmentDTO.getEndTime());
                    appointment.setActivity(activity);
                    if (instructorOptional.isPresent()) {
                        appointment.setInstructor(instructorOptional.get());
                    }
                    appointment.setMax_capacity(appointmentDTO.getMax_capacity());
                    appointment.setRecurrenceId(recurrenceId);
                    appointmentRepository.save(appointment);
                    appointmentsCreated++;

                }
                appointmentDate = appointmentDate.plusDays(1);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentsCreated);
    }

    public ResponseEntity<?> deleteAppointment(Long id, boolean deleteAllFutureAppointments) {
        int appointmentsDeleted = 0;
        try {
            Appointment appointment = this.getAppointmentById(id);
            appointment.setDeleted(true);
            appointmentRepository.save(appointment);
            appointmentsDeleted++;
            if (deleteAllFutureAppointments) {
                List<Appointment> futureAppointments = appointmentRepository.findByRecurrenceIdAndDateGreaterThan(appointment.getRecurrenceId(), appointment.getDate());
                futureAppointments.forEach(futureAppointment -> {
                    futureAppointment.setDeleted(true);
                    appointmentRepository.save(futureAppointment);
                });
                appointmentsDeleted += futureAppointments.size();
            }
            return ResponseEntity.status(HttpStatus.OK).body(appointmentsDeleted);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> updateAllAppointment(Long id, AppointmentDTO appointmentDTO) {

        if (appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }
        try {
            Appointment appointment = this.getAppointmentById(id);

            appointment.setDate(appointmentDTO.getDate());
            appointment.setStartTime(appointmentDTO.getStartTime());
            appointment.setEndTime(appointmentDTO.getEndTime());
            appointment.setMax_capacity(appointmentDTO.getMax_capacity());

            Activity activity = activityService.getActivityById(appointmentDTO.getActivityID());
            appointment.setActivity(activity);

            if (appointmentDTO.getInstructorID() != null) {
                User instructor = userService.getUserById(appointmentDTO.getInstructorID());
                appointment.setInstructor(instructor);
            }


            appointmentRepository.save(appointment);

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Transactional
    public ResponseEntity<?> updateAppointment(Long id, UpdatePATCHAppointmentDTO updateAppointmentDTO) {
        AtomicInteger appointmentsUpdated = new AtomicInteger();
        try {
            Appointment appointment = this.getAppointmentById(id);
            // modelMapper.map(updateAppointmentDTO, appointment);

            LocalDate originalDate = appointment.getDate();
            if (updateAppointmentDTO.getDate() != null) {
                appointment.setDate(updateAppointmentDTO.getDate());
            }

            if (updateAppointmentDTO.getStartTime() != null && updateAppointmentDTO.getEndTime() != null &&
                    updateAppointmentDTO.getStartTime().isBefore(updateAppointmentDTO.getEndTime())) {
                appointment.setStartTime(updateAppointmentDTO.getStartTime());
                appointment.setEndTime(updateAppointmentDTO.getEndTime());
            }

            if (updateAppointmentDTO.getActivityID() != null) {
                Activity activity = activityService.getActivityById(updateAppointmentDTO.getActivityID());
                appointment.setActivity(activity);
            }

            if (updateAppointmentDTO.getMax_capacity() != null) {
                appointment.setMax_capacity(updateAppointmentDTO.getMax_capacity());
            }

            if (updateAppointmentDTO.getInstructorID() != null) {
                User instructor = userService.getUserById(updateAppointmentDTO.getInstructorID());
                appointment.setInstructor(instructor);
            }

            appointmentRepository.save(appointment);
            appointmentsUpdated.getAndIncrement();

            if (updateAppointmentDTO.getUpdateAllFutureAppointments()) {
                Long recurrenceId = appointment.getId();
                List<Appointment> futureAppointments =
                        appointmentRepository.findByRecurrenceIdAndDateGreaterThanEqual(appointment.getRecurrenceId(), appointment.getDate());
                futureAppointments.forEach(futureAppointment -> {

                    if (updateAppointmentDTO.getDate() != null) {
                        long daysDifference = ChronoUnit.DAYS.between(originalDate, updateAppointmentDTO.getDate());
                        futureAppointment.setDate(futureAppointment.getDate().plusDays(daysDifference));
                    }

                    if (updateAppointmentDTO.getMax_capacity() != null) {
                        futureAppointment.setMax_capacity(updateAppointmentDTO.getMax_capacity());
                    }

                    if (updateAppointmentDTO.getStartTime() != null) {
                        futureAppointment.setStartTime(updateAppointmentDTO.getStartTime());
                    }

                    if (updateAppointmentDTO.getEndTime() != null) {
                        futureAppointment.setEndTime(updateAppointmentDTO.getEndTime());
                    }

                    if (updateAppointmentDTO.getActivityID() != null) {
                        Activity activity = activityService.getActivityById(updateAppointmentDTO.getActivityID());
                        futureAppointment.setActivity(activity);
                    }

                    if (updateAppointmentDTO.getInstructorID() != null) {
                        User instructor = userService.getUserById(updateAppointmentDTO.getInstructorID());
                        futureAppointment.setInstructor(instructor);
                    }
                    futureAppointment.setRecurrenceId(recurrenceId);
                    appointmentRepository.save(futureAppointment);
                    appointmentsUpdated.getAndIncrement();
                });
                appointment.setRecurrenceId(appointment.getId());
                appointmentRepository.save(appointment);
            }
            if (updateAppointmentDTO.getStartTime() != null && updateAppointmentDTO.getEndTime() != null) {
                appointment.setRecurrenceId(appointment.getId());
                appointmentRepository.save(appointment);
            }
            return ResponseEntity.status(HttpStatus.OK).body(appointmentsUpdated.get());

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    public ResponseEntity<AppointmentResponseDTO> getResponseAppointmentById(Long id) {
        try {
            Appointment appointment = this.getAppointmentById(id);
            AppointmentResponseDTO responseAppointmentDTO = modelMapper.map(appointment, AppointmentResponseDTO.class);
            responseAppointmentDTO.setActivity(appointment.getActivity().getName());
            responseAppointmentDTO.setDate(appointment.getDate().atTime(appointment.getStartTime()));
            if (appointment.getInstructor() != null) {
                responseAppointmentDTO.setInstructor(appointment.getInstructor().getFirstName() + " " + appointment.getInstructor().getLastName());
            }
            responseAppointmentDTO.setParticipantsCount(appointment.getParticipants().size());
            return ResponseEntity.status(HttpStatus.OK).body(responseAppointmentDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> addParticipant(Long appointmentId, Long userId) {
        try {
            Appointment appointment = this.getAppointmentById(appointmentId);
            User user = userService.getUserById(userId);
            if (appointment.getParticipants().contains(user)) {
                throw new CriminalCrossException("USER_ALREADY_REGISTERED", "The user is already registered in this appointment");
            }
            appointment.getParticipants().add(user);
            appointmentRepository.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    public ResponseEntity<?> removeParticipant(Long appointmentId, Long userId) {
        try {
            Appointment appointment = this.getAppointmentById(appointmentId);
            User user = userService.getUserById(userId);
            if (!appointment.getParticipants().contains(user)) {
                throw new CriminalCrossException("USER_NOT_REGISTERED", "The user is not registered in this appointment");
            }
            appointment.getParticipants().remove(user);
            appointmentRepository.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
        }
    }

    public ResponseEntity<?> createKinesiologyAppointment(KinesiologyAppointmentDTO kinesiologyAppointmentDTO) {
        int appointmentsCreated = 0;
        long firstAppointmentId = 0;

        if (kinesiologyAppointmentDTO.getStartTime().isAfter(kinesiologyAppointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }

        if (kinesiologyAppointmentDTO.getDate().isAfter(kinesiologyAppointmentDTO.getEndDate())) {
            throw new CriminalCrossException("INVALID_DATE_RANGE", "The end date must be after the start date");
        }

        Activity activity = activityService.getKinesiologyActivity();

        if (!kinesiologyAppointmentDTO.getAppointmentWeekDays().isEmpty() && kinesiologyAppointmentDTO.getAppointmentWeekDays().contains(kinesiologyAppointmentDTO.getDate().getDayOfWeek())) {
            Appointment appointment = new Appointment();
            appointment.setDate(kinesiologyAppointmentDTO.getDate());
            appointment.setStartTime(kinesiologyAppointmentDTO.getStartTime());
            appointment.setEndTime(kinesiologyAppointmentDTO.getEndTime());
            appointment.setActivity(activity);
            appointment.setMax_capacity(1);
            Appointment firstAppointment = appointmentRepository.save(appointment);
            firstAppointmentId = firstAppointment.getId();
            firstAppointment.setRecurrenceId(firstAppointmentId);
            appointmentRepository.save(firstAppointment);
            appointmentsCreated++;
            for (int i = 1; i < kinesiologyAppointmentDTO.getAppointmentQuantity(); i++) {
                appointment = new Appointment();
                appointment.setDate(kinesiologyAppointmentDTO.getDate());
                appointment.setStartTime(kinesiologyAppointmentDTO.getStartTime());
                appointment.setEndTime(kinesiologyAppointmentDTO.getEndTime());
                appointment.setActivity(activity);
                appointment.setMax_capacity(1);
                appointment.setRecurrenceId(firstAppointmentId);
                appointmentRepository.save(appointment);
                appointmentsCreated++;
            }
        }

        if (!kinesiologyAppointmentDTO.getAppointmentWeekDays().isEmpty() && kinesiologyAppointmentDTO.getEndDate().isAfter(kinesiologyAppointmentDTO.getDate())) {

            LocalDate appointmentDate = kinesiologyAppointmentDTO.getDate().plusDays(1);

            while (appointmentDate.isBefore(kinesiologyAppointmentDTO.getEndDate().plusDays(1))) {
                if (kinesiologyAppointmentDTO.getAppointmentWeekDays().contains(appointmentDate.getDayOfWeek())) {

                    Appointment appointment = new Appointment();
                    appointment.setDate(appointmentDate);
                    appointment.setStartTime(kinesiologyAppointmentDTO.getStartTime());
                    appointment.setEndTime(kinesiologyAppointmentDTO.getEndTime());
                    appointment.setActivity(activity);
                    appointment.setMax_capacity(1);
                    if (firstAppointmentId != 0) {
                        appointment.setRecurrenceId(firstAppointmentId);
                        appointmentRepository.save(appointment);
                    } else {
                        Appointment firstAppointment = appointmentRepository.save(appointment);
                        firstAppointmentId = firstAppointment.getId();
                        firstAppointment.setRecurrenceId(firstAppointmentId);
                        appointmentRepository.save(firstAppointment);
                    }
                    appointmentsCreated++;

                    for (int i = 1; i < kinesiologyAppointmentDTO.getAppointmentQuantity(); i++) {
                        appointment = new Appointment();
                        appointment.setDate(appointmentDate);
                        appointment.setStartTime(kinesiologyAppointmentDTO.getStartTime());
                        appointment.setEndTime(kinesiologyAppointmentDTO.getEndTime());
                        appointment.setActivity(activity);
                        appointment.setMax_capacity(1);
                        appointment.setRecurrenceId(firstAppointmentId);
                        appointmentRepository.save(appointment);
                        appointmentsCreated++;
                    }
                }
                appointmentDate = appointmentDate.plusDays(1);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentsCreated);
    }

    public ResponseEntity<List<AppointmentListResponseDTO>> getKinesiologyAppointmentByDate(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDateAndDeletedFalseOrderByStartTime(date);
        return getListResponseEntity(appointments);
    }
}
