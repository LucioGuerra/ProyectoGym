package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.ExerciseTrackingDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.service.UserService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/public/users")

public class UserController {
    private final UserService userService;


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        return userService.getAllUsers();
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUserById(id));
    }

    @PostMapping("/{id}/tracking")
    public ResponseEntity<?> trackWeight(@PathVariable Long id,
                                            @RequestBody ExerciseTrackingDTO exerciseTrackingDTO){
        //return ResponseEntity.status(HttpStatus.CREATED).body("Tracking created");
        return userService.trackDateWeight(id, exerciseTrackingDTO);
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    


    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetail) {
        return userService.updateUser(id, userDetail);
    }


}
