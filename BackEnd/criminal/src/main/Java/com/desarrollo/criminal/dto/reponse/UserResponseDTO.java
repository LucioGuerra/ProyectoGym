package com.desarrollo.criminal.dto.reponse;


import com.desarrollo.criminal.entity.user.Role;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.entity.tracking.Tracking;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;



@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    private Long id; 

    private String firstName;

    private String lastName;

    private String email;

    private String dni;

    private Role role;

    private String phone;

    private LocalDateTime createdAt; 

    private LocalDateTime updatedAt;
    
    private Routine routine;

    private Package aPackage;

    private List<Tracking> trackings;

}


