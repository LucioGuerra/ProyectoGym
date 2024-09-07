package com.desarrollo.criminal.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.service.UserService;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api")

public class UserController {
    private final UserService userService;


    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(){
        return userService.getAllUsers();
    }
    

    @GetMapping("/user/{id}")
    public ResponseEntity<List<User>> getUserById(@PathVariable Long id){
        return userService.getUserById();
    }



    @PostMapping("/user/singup")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    


    @PutMapping("update/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetail) {
        return userService.updateUser(id, userDetail);
    }


}
