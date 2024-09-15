package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExcerciseTrackingDTO;
import com.desarrollo.criminal.entity.tracking.DateWeight;
import com.desarrollo.criminal.entity.tracking.Tracking;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service

public class UserService {

    private final UserRepository userRepository;
    private final TrackingService trackingService;


    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUsers = userRepository.findAll();  

        if (allUsers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(allUsers);
        }
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow( () -> new RuntimeException("User not found"));

    }

    public ResponseEntity<User> createUser(User user) {
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
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

    public ResponseEntity<?> createTracking(Long userID, ExcerciseTrackingDTO exerciseTrackingDTO) {

        User user = getUserById(userID);

        DateWeight dateWeight = new DateWeight();
        dateWeight.setWeight(exerciseTrackingDTO.getWeight());
        dateWeight.setDate(exerciseTrackingDTO.getDate());

        Tracking tracking = trackingService.SearchTrackingByUserIDAndExerciseID(userID, exerciseTrackingDTO.getExcerciseID());
        tracking.addDateWeight(dateWeight);

        user.addTracking(tracking);
        saveUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("Tracking created successfully");
    }
}



    
    


