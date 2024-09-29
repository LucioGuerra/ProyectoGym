package com.desarrollo.criminal.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.service.UserService;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

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
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.status(HttpStatus.OK).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    


    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetail) {
        return userService.updateUser(id, userDetail);
    }


}
