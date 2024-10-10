package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
        @Size(min = 1, max = 25, message = "First name must be between 1 and 25 characters.")
        String firstName,

        @Size(min = 1, max = 25, message = "Last name must be between 1 and 25 characters.")
        String lastName,

        @Email(message = "Email should be valid.")
        String email,

        @Size(min = 8, max = 8, message = "DNI must be composed of 8 characters.")
        String dni,

        String phone,

        Role role) {
}