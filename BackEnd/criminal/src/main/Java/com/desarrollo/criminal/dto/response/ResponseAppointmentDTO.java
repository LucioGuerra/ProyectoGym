package com.desarrollo.criminal.dto.response;

import com.desarrollo.criminal.entity.user.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class ResponseAppointmentDTO {
    private Long id;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String activity;

    private String instructor;

    private List<AppointmentUserDTO> participants;

    private ResponseAppointmentDTO() {}
}
