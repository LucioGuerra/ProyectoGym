package com.desarrollo.criminal.dto.response;


import com.desarrollo.criminal.entity.user.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;



@Setter
@Getter
@AllArgsConstructor
public class UserResponseDTO {

    private Long id; 

    private String firstName;

    private String lastName;

    private String email;

    private String dni;

    private Role role;

    private String phone;
    
    private Long routineId;

    private Long aPackageId;


    private UserResponseDTO(){}

}


