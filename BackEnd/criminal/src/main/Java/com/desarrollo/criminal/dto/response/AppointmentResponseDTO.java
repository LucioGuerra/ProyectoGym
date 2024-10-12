package com.desarrollo.criminal.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class AppointmentResponseDTO {
    private Long id;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String activity;

    private String instructor;

    private Long max_capacity;

    private Integer participantsCount;

    private List<AppointmentUserDTO> participants;

    private AppointmentResponseDTO() {}

}
