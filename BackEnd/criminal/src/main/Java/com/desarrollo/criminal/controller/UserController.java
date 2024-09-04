package com.desarrollo.criminal.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desarrollo.criminal.repository.UserRepository;
import com.desarrollo.criminal.entity.user.User;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){
        return userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("the user with id: " + id + " was not found"));
    }

    @PostMapping
    public User createUser(@RequestBody User user){
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userdetail){
        User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("the user with id: " + id + " was not found"));

        user.setFirstName(userdetail.getFirstName());
        user.setLastName(userdetail.getLastName());
        user.setEmail(userdetail.getEmail());
        user.setDni(userdetail.getDni());
        user.setRole(userdetail.getRole());
        user.setPhone(userdetail.getPhone());
        user.setCreditExpiration(userdetail.getCreditExpiration());

        return userRepository.save(user);
    }

}
