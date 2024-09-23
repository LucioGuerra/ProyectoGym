package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.user.Role;
import jakarta.validation.constraints.NotEmpty;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.entity.tracking.Tracking;
import java.time.LocalDateTime;
import java.util.List;

public class UserDTO {

    private Long id; 
    
    @NotEmpty(message = "First name's field cannot be empty.")
    private String firstName;

    @NotEmpty(message = "Last name's field cannot be empty.")
    private String lastName;

    @NotEmpty(message = "Email's field cannot be empty.")
    private String email;

    @NotEmpty(message = "DNI's field cannot be empty.")
    private String dni;

    private Role role;

    @NotEmpty(message = "Phone's field cannot be empty.")
    private String phone;

    private LocalDateTime createdAt; 
    private LocalDateTime updatedAt;
    private Routine routine;
    private Package aPackage;
    private List<Tracking> trackings;


    public UserDTO() {
        this.role = Role.CLIENT;
    }


    // Constructor REQUEST

    public UserDTO(String firstName, String lastName, String email, String dni, 
                   Role role, String phone, Routine routine, Package aPackage) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dni = dni;
        this.role = role;
        this.phone = phone;
        this.routine = routine;
        this.aPackage = aPackage;
    }


    // Constructor RESPONSE
    public UserDTO(Long id, String firstName, String lastName, String email, 
                   String dni, Role role, String phone, LocalDateTime createdAt, 
                   LocalDateTime updatedAt, Routine routine, Package aPackage, List<Tracking> trackings) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dni = dni;
        this.role = role;
        this.phone = phone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.routine = routine;
        this.aPackage = aPackage;
        this.trackings = trackings;
    }


    
    // GETTERS
    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getDni() {
        return dni;
    }

    public Role getRole() {
        return role;
    }

    public String getPhone() {
        return phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Routine getRoutine() {
        return routine;
    }

    public Package getPackage() {
        return aPackage;
    }

    public List<Tracking> getTrackings() {
        return trackings;
    }



    // SETTERS 
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setRoutine(Routine routine) {
        this.routine = routine;
    }

    public void setPackage(Package aPackage) {
        this.aPackage = aPackage;
    }

    public void setTrackings(List<Tracking> trackings) {
        this.trackings = trackings;
    }
}
