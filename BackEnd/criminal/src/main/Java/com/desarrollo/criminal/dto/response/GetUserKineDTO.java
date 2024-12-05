package com.desarrollo.criminal.dto.response;

import lombok.Data;

@Data
public class GetUserKineDTO {
    private String dni;
    private String firstName;
    private String lastName;
    private String email;

}
