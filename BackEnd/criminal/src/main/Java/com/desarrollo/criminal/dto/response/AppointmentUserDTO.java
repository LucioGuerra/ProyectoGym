package com.desarrollo.criminal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AppointmentUserDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private Boolean attendance;

    public AppointmentUserDTO() {}

}
