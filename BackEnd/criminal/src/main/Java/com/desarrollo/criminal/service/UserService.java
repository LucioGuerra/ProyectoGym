package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.UserUpdateDTO;
import com.desarrollo.criminal.entity.user.Role;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.response.UserResponseDTO;
import com.desarrollo.criminal.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

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


    public ResponseEntity<List<GetPackageDTO>> getUserHistory(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        List<Package> packages = re
        List<GetPackageDTO> packagesDTO = packages.stream()
                .map(package -> modelMapper.map(package, GetPackageDTO.class)).toList();

        return ResponseEntity.status(HttpStatus.OK).body(packagesDTO);
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
        if(Optional.ofNullable(userUpdateDTO.role()).isPresent()) {
            user.setRole(userUpdateDTO.role());
        }

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
}