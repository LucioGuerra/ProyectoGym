package com.desarrollo.criminal.controller;

import com.desarrollo.criminal.dto.request.UserUpdateDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.dto.response.GetUserAppointmentDTO;
import jakarta.validation.constraints.Email;
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

    @GetMapping("/admins")
    public ResponseEntity<List<UserResponseDTO>> getAdmins(){
        return userService.getUserAdmins();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id){
        return userService.getUserDTOById(id);
    }

    @GetMapping("/email")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@RequestParam("email") @Email String email){
        return userService.getUserByEmail(email);
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<UserResponseDTO> getUserByDni(@PathVariable String dni){
        return userService.getUserEntityByDni(dni);
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<List<GetPackageDTO>> getUserHistory(@PathVariable Long id){
        return userService.getUserHistory(id);
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<List<GetUserAppointmentDTO>> getUserAppointments(@PathVariable Long id){
        return userService.getUserAppointments(id);
    }

    @GetMapping("/package/{id}")
    public ResponseEntity<GetPackageDTO> getUserPackages(@PathVariable Long id){
        return userService.getActivePackage(id);
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        return userService.createUser(userRequestDTO);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userUpdateDTO){
        return userService.updateUser(id, userUpdateDTO);
    }

}
