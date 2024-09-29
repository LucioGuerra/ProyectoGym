package com.desarrollo.criminal.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.reponse.UserResponseDTO;
import com.desarrollo.criminal.service.UserService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")

public class UserController {
    private final UserService userService;


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        return userService.getAllUsers();
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }


    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO  
    userRequestDTO) {

        return userService.createUser(userRequestDTO);
    }
    


    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetail) {
        return userService.updateUser(id, userDetail);
    }


}
