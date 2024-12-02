package com.desarrollo.criminal.dto.response;


import com.desarrollo.criminal.entity.user.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.net.URL;


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

    private URL picture;
    
    private Long routineId;

    //todo agregar para obtenerlo
    private Long aPackageId;


    private UserResponseDTO(){}

}


