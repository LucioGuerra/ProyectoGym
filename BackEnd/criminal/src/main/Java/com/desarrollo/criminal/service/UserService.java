package com.desarrollo.criminal.service;

import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.reponse.UserResponseDTO;
import com.desarrollo.criminal.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.hibernate.MappingException;
import org.modelmapper.ModelMapper;
import com.desarrollo.criminal.exception.CriminalCrossException;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service

public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUsers = userRepository.findAll();  

        if (allUsers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(allUsers);
        }
    }

    public ResponseEntity<User> getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



    public ResponseEntity<UserResponseDTO> createUser(UserRequestDTO userRequestDTO) {

        try {
        User user = modelMapper.map(userRequestDTO, User.class);
        User savedUser = userRepository.save(user);

        UserResponseDTO userResponseDTO = modelMapper.map(savedUser, UserResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDTO);
    

        } catch (MappingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }




    public ResponseEntity<User> updateUser(Long id, User userDetail) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            user.setFirstName(userDetail.getFirstName());
            user.setLastName(userDetail.getLastName());
            user.setEmail(userDetail.getEmail());
            user.setDni(userDetail.getDni());
            user.setRole(userDetail.getRole());
            user.setPhone(userDetail.getPhone());

            User updatedUser = userRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).body(updatedUser);

        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    private User saveUser(User user) {
        return userRepository.save(user);
    }
 
}



    
    


