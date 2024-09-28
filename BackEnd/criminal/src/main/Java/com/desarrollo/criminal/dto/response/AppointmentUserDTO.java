package com.desarrollo.criminal.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentUserDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private AppointmentUserDTO() {}
}
