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
        return userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));
    }

    public ResponseEntity<UserResponseDTO> getUserDTOById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));

        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
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

        if(Optional.ofNullable(userUpdateDTO.getFirstName()).isPresent()) {
            user.setFirstName(userUpdateDTO.getFirstName());
        }
        if(Optional.ofNullable(userUpdateDTO.getLastName()).isPresent()) {
            user.setLastName(userUpdateDTO.getLastName());
        }
        if(Optional.ofNullable(userUpdateDTO.getEmail()).isPresent()) {
            user.setEmail(userUpdateDTO.getEmail());
        }
        if(Optional.ofNullable(userUpdateDTO.getDni()).isPresent()) {
            user.setDni(userUpdateDTO.getDni());
        }
        if(Optional.ofNullable(userUpdateDTO.getPhone()).isPresent()) {
            user.setPhone(userUpdateDTO.getPhone());
        }
        if(Optional.ofNullable(userUpdateDTO.getRole()).isPresent()) {
            user.setRole(userUpdateDTO.getRole());
        }

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(user, UserResponseDTO.class));
    }
    
    private User saveUser(User user) {
        return userRepository.save(user);
    }
}



    
    


