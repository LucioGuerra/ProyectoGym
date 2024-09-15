package com.desarrollo.criminal.service;

import com.desarrollo.criminal.dto.request.ExerciseTrackingDTO;
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
    private final ExerciseService exerciseService;


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
    
    private void saveUser(User user) {
        userRepository.save(user);
    }

    public ResponseEntity<?> createTracking(Long userID, ExerciseTrackingDTO exerciseTrackingDTO) {

        User user = getUserById(userID);

        DateWeight dateWeight = new DateWeight();
        dateWeight.setWeight(exerciseTrackingDTO.getWeight());
        dateWeight.setDate(exerciseTrackingDTO.getDate());

        Tracking tracking = trackingService.SearchTrackingOfUserByExerciseID(user.getTrackings(),
                exerciseTrackingDTO.getExerciseID());
        if (tracking == null) {
            tracking = new Tracking();
            tracking.setExercise(exerciseService.getExerciseById(exerciseTrackingDTO.getExerciseID()));
            user.addTracking(tracking);
        }
        dateWeight.setTracking(tracking);
        tracking.addDateWeight(dateWeight);

        saveUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("Tracking created successfully");
    }
}



    
    


