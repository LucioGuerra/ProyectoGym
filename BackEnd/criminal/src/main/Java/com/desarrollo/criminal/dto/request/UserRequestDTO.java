package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.net.URL;


@Setter
@Getter
@AllArgsConstructor
public class UserRequestDTO {
    
    @NotBlank(message = "First name cannot be empty.")
    @Size(min = 1, max = 25, message = "First name must be between 1 and 25 characters.")
    private String firstName;

    @NotBlank(message = "Last name's field cannot be empty.")
    @Size(min = 1, max = 25, message = "Last name must be between 1 and 25 characters.")
    private String lastName;

    @NotBlank(message = "Email cannot be empty.")
    @Email(message = "Email should be valid.")
    private String email;

    @NotBlank(message = "DNI cannot be empty.")
    @Size(min = 8, max = 8, message = "DNI must be composed of 8 characters.")
    private String dni;

    @NotBlank(message = "Phone cannot be empty.")
    private String phone;

    private URL picture;

    private UserRequestDTO(){}

}