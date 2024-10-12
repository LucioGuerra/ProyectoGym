package com.desarrollo.criminal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.net.URL;

@Getter
@Setter
@AllArgsConstructor
public class AppointmentUserDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private Boolean attendance;

    private URL picture;

    public AppointmentUserDTO() {}

}
