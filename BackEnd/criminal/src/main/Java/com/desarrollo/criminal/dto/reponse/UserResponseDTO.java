package com.desarrollo.criminal.dto.reponse;


import com.desarrollo.criminal.entity.user.Role;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.entity.tracking.Tracking;
import java.util.List;
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
    
    private Routine routine;

    private Package aPackage;

    private List<Tracking> trackings;


    private UserResponseDTO(){}

}


