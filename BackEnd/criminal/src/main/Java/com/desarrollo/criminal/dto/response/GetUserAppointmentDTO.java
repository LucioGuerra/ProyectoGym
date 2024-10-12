package com.desarrollo.criminal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
public class GetUserAppointmentDTO {
    private Long id;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String activity;

    private Integer max_capacity;

    private Integer participantsCount;

    private Boolean attendance;

    private GetUserAppointmentDTO() {
    }
}
