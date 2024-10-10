package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.UserUpdateDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.response.UserResponseDTO;
import com.desarrollo.criminal.service.UserService;

import jakarta.validation.Valid;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/public/users")

public class UserController {
    private final UserService userService;


    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers(){
        return userService.getAllUsers();
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id){
        return userService.getUserDTOById(id);
    }



    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        return userService.createUser(userRequestDTO);
    }
    


    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userUpdateDTO){
        return userService.updateUser(id, userUpdateDTO);
    }
}
