package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.UserUpdateDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.dto.response.GetUserAppointmentDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.Role;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.response.UserResponseDTO;
import com.desarrollo.criminal.entity.user.UserXAppointment;
import com.desarrollo.criminal.exception.CriminalCrossException;
import com.desarrollo.criminal.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.modelmapper.ModelMapper;

import java.util.*;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> allUsers = userRepository.findAll();

        List<UserResponseDTO> usersDTO = allUsers.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class)).toList();

        return ResponseEntity.status(HttpStatus.OK).body(usersDTO);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public ResponseEntity<UserResponseDTO> getUserDTOById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
    }

    public ResponseEntity<UserResponseDTO> getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new EntityNotFoundException("User not found with email: " + email));

        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
    }

    public ResponseEntity<List<GetPackageDTO>> getUserHistory(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        List<GetPackageDTO> packagesDTO = user.getAPackage().stream()
                .map(aPackage -> {
                    GetPackageDTO dto = modelMapper.map(aPackage, GetPackageDTO.class);
                    dto.setCreatedAt(aPackage.getCreatedAt().toLocalDate());
                    return dto;
                }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(packagesDTO);
    }

    public ResponseEntity<GetPackageDTO> getActivePackage(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        Package activePackage = user.getAPackage().stream().filter(Package::getActive).findFirst().orElseThrow(() ->
                new CriminalCrossException("NO_ACTIVE_PACKAGE", "User has no active package"));

        GetPackageDTO packageDTO = modelMapper.map(activePackage, GetPackageDTO.class);
        packageDTO.setCreatedAt(activePackage.getCreatedAt().toLocalDate());
        return ResponseEntity.status(HttpStatus.OK).body(packageDTO);
    }

    public ResponseEntity<UserResponseDTO> createUser(UserRequestDTO userRequestDTO) {
        User user = modelMapper.map(userRequestDTO, User.class);
        user.setRole(Role.CLIENT);
        User savedUser = userRepository.save(user);

        UserResponseDTO userResponseDTO = modelMapper.map(savedUser, UserResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDTO);
    }

    public ResponseEntity<UserResponseDTO> updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        if(Optional.ofNullable(userUpdateDTO.firstName()).isPresent()) {
            user.setFirstName(userUpdateDTO.firstName());
        }
        if(Optional.ofNullable(userUpdateDTO.lastName()).isPresent()) {
            user.setLastName(userUpdateDTO.lastName());
        }
        if(Optional.ofNullable(userUpdateDTO.email()).isPresent()) {
            user.setEmail(userUpdateDTO.email());
        }
        if(Optional.ofNullable(userUpdateDTO.dni()).isPresent()) {
            user.setDni(userUpdateDTO.dni());
        }
        if(Optional.ofNullable(userUpdateDTO.phone()).isPresent()) {
            user.setPhone(userUpdateDTO.phone());
        }
        if(Optional.ofNullable(userUpdateDTO.picture()).isPresent()) {
            user.setPicture(userUpdateDTO.picture());
        }
        if(Optional.ofNullable(userUpdateDTO.role()).isPresent()) {
            if (userUpdateDTO.role().equals("ADMIN")) {
                user.setRole(Role.ADMIN);
            }
            if (userUpdateDTO.role().equals("CLIENT")) {
                user.setRole(Role.CLIENT);
            }
        }

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
    }

    public ResponseEntity<List<GetUserAppointmentDTO>> getUserAppointments(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        List<Appointment> appointments = user.getUserXAppointments().stream()
                .map(UserXAppointment::getAppointment).toList();

        List<GetUserAppointmentDTO> appointmentsDTO = appointments.stream()
                .map(appointment -> {
                    GetUserAppointmentDTO responseAppointmentDTO = modelMapper.map(appointment, GetUserAppointmentDTO.class);
                    responseAppointmentDTO.setActivity(appointment.getActivity().getName());
                    responseAppointmentDTO.setParticipantsCount(appointment.getParticipants().size());
                    responseAppointmentDTO.setAttendance(user.getUserXAppointments().stream()
                            .filter(userXAppointment -> userXAppointment.getAppointment().equals(appointment))
                            .findFirst().orElseThrow(() -> new CriminalCrossException("USER_NOT_IN_APPOINTMENT", "User not in appointment"))
                            .getAttendance());
                    return responseAppointmentDTO;
                })
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(appointmentsDTO);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByDni(String dni) {
        return userRepository.findByDni(dni);
    }

    public ResponseEntity<UserResponseDTO> getUserEntityByDni(String dni) {
        User user = this.getUserByDni(dni).orElseThrow(() ->
                new EntityNotFoundException("User not found with dni: " + dni));

        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
    }

    public ResponseEntity<List<UserResponseDTO>> getAllAdmins() {
        List<User> allAdmins = userRepository.findAllByRole(Role.ADMIN);

        List<UserResponseDTO> adminsDTO = allAdmins.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class)).toList();

        return ResponseEntity.status(HttpStatus.OK).body(adminsDTO);
    }
}