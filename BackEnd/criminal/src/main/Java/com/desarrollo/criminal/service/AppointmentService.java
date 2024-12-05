package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.*;
import com.desarrollo.criminal.dto.response.*;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.PackageActivity;
import com.desarrollo.criminal.entity.user.Role;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.entity.user.UserXAppointment;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.exception.CriminalCrossException;
import com.desarrollo.criminal.repository.AppointmentRepository;
import com.desarrollo.criminal.repository.UserXAppointmentRepository;
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
import java.util.function.Function;

@AllArgsConstructor
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ActivityService activityService;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final UserXAppointmentRepository userXAppointmentRepository;
    private final PackageActivityService packageActivityService;


    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId).orElseThrow(() -> new EntityNotFoundException(
                "Appointment not found with id: " + appointmentId));
    }

    public ResponseEntity<List<AppointmentListResponseDTO>> getAppointmentByDate(LocalDate date) {
        List<Appointment> appointments =
                appointmentRepository.findByDateAndActivity_NameNotAndDeletedFalseOrderByStartTime(date,
                        "Kinesiologia");
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
        List<Appointment> appointments = appointmentRepository.findAllAndDeletedFalse();
        return getListResponseEntity(appointments);
    }

    @Transactional
    public ResponseEntity<?> createAppointment(AppointmentDTO appointmentDTO) {
        long recurrenceId = 0;
        int appointmentsCreated = 0;

        if (appointmentDTO.getStartTime().isAfter(appointmentDTO.getEndTime())) {
            throw new CriminalCrossException("INVALID_TIME_RANGE", "The start time must be before the end time");
        }

        if (appointmentDTO.getDate().isAfter(appointmentDTO.getEndDate())) {
            throw new CriminalCrossException("INVALID_DATE_RANGE", "The end date must be after the start date");
        }

        Activity activity = activityService.getActivityById(appointmentDTO.getActivityID());

        Optional<User> instructorOptional = Optional.ofNullable(appointmentDTO.getInstructorID())
                .map(userService::getUserById);


        if (!appointmentDTO.getAppointmentWeekDays().isEmpty() && appointmentDTO.getAppointmentWeekDays().contains(appointmentDTO.getDate().getDayOfWeek())) {
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
            recurrenceId = appointment.getId();
            appointment.setRecurrenceId(recurrenceId);
            appointmentRepository.save(appointment);
            appointmentsCreated++;
        } else if(appointmentDTO.getAppointmentWeekDays().isEmpty()){
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
            recurrenceId = appointment.getId();
            appointment.setRecurrenceId(recurrenceId);
            appointmentRepository.save(appointment);
            appointmentsCreated++;
        }

        if (!appointmentDTO.getAppointmentWeekDays().isEmpty() && appointmentDTO.getEndDate().isAfter(appointmentDTO.getDate())) {

            LocalDate appointmentDate = appointmentDTO.getDate().plusDays(1);

            while (appointmentDate.isBefore(appointmentDTO.getEndDate().plusDays(1))) {
                if (appointmentDTO.getAppointmentWeekDays().contains(appointmentDate.getDayOfWeek())) {

                    Appointment appointment = new Appointment();
                    appointment.setDate(appointmentDate);
                    appointment.setStartTime(appointmentDTO.getStartTime());
                    appointment.setEndTime(appointmentDTO.getEndTime());
                    appointment.setActivity(activity);
                    if (instructorOptional.isPresent()) {
                        appointment.setInstructor(instructorOptional.get());
                    }
                    appointment.setMax_capacity(appointmentDTO.getMax_capacity());
                    if(recurrenceId == 0){
                        Appointment firstAppointment = appointmentRepository.save(appointment);
                        recurrenceId = firstAppointment.getId();
                        firstAppointment.setRecurrenceId(recurrenceId);
                        appointmentRepository.save(firstAppointment);
                    }else {
                        appointment.setRecurrenceId(recurrenceId);
                        appointmentRepository.save(appointment);
                    }
                    appointmentsCreated++;

                }
                appointmentDate = appointmentDate.plusDays(1);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentsCreated);
    }

    @Transactional
    public ResponseEntity<?> deleteAppointment(Long id, boolean deleteAllFutureAppointments) {
        int appointmentsDeleted = 0;
        Appointment appointment = this.getAppointmentById(id);

        removeParticipants(appointment);
        appointmentsDeleted++;

        if (deleteAllFutureAppointments) {
            List<Appointment> futureAppointments = appointmentRepository.findByRecurrenceIdAndDateGreaterThan(appointment.getRecurrenceId(), appointment.getDate());

            futureAppointments.forEach(this::removeParticipants);
            appointmentsDeleted += futureAppointments.size();
        }
        return ResponseEntity.status(HttpStatus.OK).body(appointmentsDeleted);
    }

    @Transactional
    protected void removeParticipants(Appointment appointment) {
        if (!appointment.getParticipants().isEmpty()) {
            int participants = appointment.getParticipants().size();
            while(participants > 0){
                this.removeParticipant(appointment.getId(), appointment.getParticipants().get(0).getId());
                participants--;
            }
        }

        appointment.setDeleted(true);
        appointmentRepository.save(appointment);
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
                if (updateAppointmentDTO.getInstructorID() == -1) {
                    appointment.setInstructor(null);
                } else {
                    User instructor = userService.getUserById(updateAppointmentDTO.getInstructorID());
                    appointment.setInstructor(instructor);
                }
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
        Appointment appointment =
                appointmentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(
                        "Appointment not found with id: " + id));
        if(appointment.isDeleted()){
            throw new CriminalCrossException("APPOINTMENT_DELETED", "The appointment has been deleted");
        }
        return ResponseEntity.status(HttpStatus.OK).body(convertAppointmentToDTO(appointment));
    }

    private AppointmentResponseDTO convertAppointmentToDTO(Appointment appointment) {
        AppointmentResponseDTO responseAppointmentDTO = modelMapper.map(appointment, AppointmentResponseDTO.class);
        responseAppointmentDTO.setActivity(appointment.getActivity().getName());
        responseAppointmentDTO.setDate(appointment.getDate().atTime(appointment.getStartTime()));
        if (Optional.ofNullable(appointment.getInstructor()).isPresent()) {
            responseAppointmentDTO.setInstructor(appointment.getInstructor().getFirstName() + " " + appointment.getInstructor().getLastName());
        }

        responseAppointmentDTO.setParticipantsCount(appointment.getParticipants().size());

        List<AppointmentUserDTO> participants = appointment.getParticipants().stream()
                .map(user -> {
                    AppointmentUserDTO appointmentUserDTO = modelMapper.map(user, AppointmentUserDTO.class);
                    appointmentUserDTO.setAttendance(user.getUserXAppointments().stream()
                            .filter(userXAppointment -> userXAppointment.getAppointment().equals(appointment))
                            .findFirst()
                            .map(UserXAppointment::getAttendance)
                            .orElse(false));
                    appointmentUserDTO.setPicture(user.getPicture());
                    return appointmentUserDTO;
                })
                .toList();

        responseAppointmentDTO.setParticipants(participants);
        return responseAppointmentDTO;
    }

    @Transactional
    public ResponseEntity<?> addParticipant(Long appointmentId, Long userId) {
        Appointment appointment = this.getAppointmentById(appointmentId);
        User user = userService.getUserById(userId);

        Package userPackage =
                user.getAPackage().stream().filter(Package::getActive).findFirst().orElseThrow(() -> new CriminalCrossException(
                        "USER_HAS_NO_ACTIVE_PACKAGE", "The user has no active package"));

        PackageActivity packageActivity = packageActivityService.findPackageActivityByActivityIdAndPackageId(appointment.getActivity().getId(),
                userPackage.getId()).orElseThrow(() -> new CriminalCrossException("USER_HAS_NO_ACTIVITY", "The user " +
                "has no activity in his package"));

        this.validateAddParticipant(appointment, user, packageActivity);

        appointment.getParticipants().add(user);
        user.getUserXAppointments().add(new UserXAppointment(appointment, user));
        packageActivity.setQuantity(packageActivity.getQuantity() - 1);

        packageActivityService.save(packageActivity);
        appointmentRepository.save(appointment);
        userService.save(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private void validateAddParticipant(Appointment appointment, User user, PackageActivity packageActivity) {
        if (appointment.getMax_capacity() == appointment.getParticipants().size()){
            throw new CriminalCrossException("APPOINTMENTS_IS_FULL", "The appointment is full");
        }

        if (packageActivity.getQuantity() == 0){
            throw new CriminalCrossException("USER_NO_CREDITS", "The user doesn't have enough credits for this activity");
        }

        appointmentRepository.findAppointmentByDateAndStartTimeAndParticipantsContains(appointment.getDate(),
                appointment.getStartTime(), user).ifPresent(a -> {throw new CriminalCrossException(
                        "USER_ALREADY_REGISTERED", "The user is already registered in this appointment");});
    }

    @Transactional
    public ResponseEntity<?> removeParticipant(Long appointmentId, Long userId) {
        Appointment appointment = this.getAppointmentById(appointmentId);
        User user = userService.getUserById(userId);

        if (!appointment.getParticipants().contains(user)) {
            throw new CriminalCrossException("USER_NOT_REGISTERED", "The user is not registered in this appointment");
        }

        PackageActivity packageActivity =
                user.getAPackage().stream().map(pack -> pack.getPackageActivities().stream().filter(packAct ->
                        packAct.getActivity().getId().equals(appointment.getActivity().getId())).findFirst().orElseThrow(() -> new CriminalCrossException("USER_HAS_NO_ACTIVITY", "The user has no activity in his package"))).findFirst().get();



        packageActivity.setQuantity(packageActivity.getQuantity() + 1);
        appointment.getParticipants().remove(user);
        userXAppointmentRepository.deleteByAppointmentAndUser(appointment, user);
        packageActivityService.save(packageActivity);
        appointmentRepository.save(appointment);
        userService.save(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Transactional
    public ResponseEntity<?> switchParticipantAttendance(Long appointmentId, Long userId) {
        Appointment appointment = this.getAppointmentById(appointmentId);
        User user = userService.getUserById(userId);

        if (!appointment.getParticipants().contains(user)) {
            throw new CriminalCrossException("USER_NOT_REGISTERED", "The user is not registered in this appointment");
        }

        user.getUserXAppointments().stream()
                .filter(userXAppointment -> userXAppointment.getAppointment().equals(appointment))
                .findFirst()
                .ifPresent(userXAppointment -> userXAppointment.setAttendance(!userXAppointment.getAttendance()));

        userService.save(user);

        return ResponseEntity.status(HttpStatus.OK).body(user.getUserXAppointments().stream().filter(userXAppointment -> userXAppointment.getAppointment().equals(appointment)).findFirst().get().getAttendance());
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
        } else if (kinesiologyAppointmentDTO.getAppointmentWeekDays().isEmpty()) {
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
        List<Appointment> appointments =
                appointmentRepository.findByDateAndActivity_NameAndDeletedFalseOrderByStartTime(date, "Kinesiologia");
        return getListResponseEntity(appointments);
    }

    public ResponseEntity<List<GetAppointmentKineDTO>> getKinesiologyAppointmentByDni(String dni) {
        Optional<User> kine = userService.getUserByDni(dni);

        if (kine.isEmpty()) {
            throw new CriminalCrossException("KINESIOLOGO_NOT_EXIST", "The kinesiologo not be exist");
        }

        List<Appointment> appointments = appointmentRepository.findAppointmentsByInstructorDniAndRole(dni, Role.KINE);


        List<GetAppointmentKineDTO> appointmentsDTO = appointments.stream().map(this::convertAppointmentKineToDTO).toList();

        return ResponseEntity.status(HttpStatus.OK).body(appointmentsDTO);
    }


    @Transactional
    public ResponseEntity<?> addParticipantToKinesiology(Long appointmentId, UserRequestDTO userRequestDTO) {
        Appointment appointment = this.getAppointmentById(appointmentId);

        if (!appointment.getActivity().getName().equals("Kinesiologia")) {
            throw new CriminalCrossException("APPOINTMENT_NOT_KINESIOLOGY", "The appointment is not a kinesiology appointment");
        }

        if (appointment.getParticipants().size() == 1) {
            throw new CriminalCrossException("APPOINTMENT_IS_FULL", "The appointment is full");
        }

        Optional<User> user = userService.getUserByDni(userRequestDTO.getDni());

        if (user.isEmpty()) {
            userService.createUser(userRequestDTO);
            user = userService.getUserByDni(userRequestDTO.getDni());
        }


        appointment.getParticipants().add(user.get());
        user.get().getUserXAppointments().add(new UserXAppointment(appointment, user.get()));

        appointmentRepository.save(appointment);
        userService.save(user.get());


        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Transactional
    public ResponseEntity<?> removeParticipantFromKinesiology(Long appointmentId, String userDni) {
        Appointment appointment = this.getAppointmentById(appointmentId);
        User user = userService.getUserByDni(userDni).orElseThrow(() -> new EntityNotFoundException("The user was not found with dni: " + userDni));

        if (appointment.getParticipants().isEmpty()) {
            throw new CriminalCrossException("APPOINTMENT_IS_EMPTY", "The appointment is empty");
        }

        appointment.getParticipants().remove(user);
        userXAppointmentRepository.deleteByAppointmentAndUser(appointment, user);
        appointmentRepository.save(appointment);
        userService.save(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> createKine(UserRequestDTO userRequestDTO) {
            Optional<User> kine = userService.getUserByDni(userRequestDTO.getDni());
            if (kine.isPresent()) {
                throw new CriminalCrossException("KINESIOLOGO_ALREADY_CREATED", "The kinesiologo already exists");
            }

            userService.createUser(userRequestDTO);
            kine = userService.getUserByDni(userRequestDTO.getDni());
            if (kine.isEmpty()) {
                throw new CriminalCrossException("KINESIOLOGO_NOT_CREATED", "The kinesiologo could not be created");
            }
            User user = kine.get();

            user.setRole(Role.KINE);

            userService.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private GetAppointmentKineDTO convertAppointmentKineToDTO(Appointment appointment) {
        GetAppointmentKineDTO getAppointmentKineDTO = new GetAppointmentKineDTO();
        getAppointmentKineDTO.setId(appointment.getId());
        getAppointmentKineDTO.setDate(appointment.getDate());
        getAppointmentKineDTO.setStartTime(appointment.getStartTime());
        getAppointmentKineDTO.setEndTime(appointment.getEndTime());
        getAppointmentKineDTO.setKineDni(appointment.getInstructor().getDni());

        if (!appointment.getParticipants().isEmpty()) {
            GetUserKineDTO userKineDTO = new GetUserKineDTO();
            User user = appointment.getParticipants().get(0);

            userKineDTO.setDni(user.getDni());
            userKineDTO.setFirstName(user.getFirstName());
            userKineDTO.setLastName(user.getLastName());
            userKineDTO.setEmail(user.getEmail());

            getAppointmentKineDTO.setUser(userKineDTO);
        }

        return getAppointmentKineDTO;
    }
}
