package com.desarrollo.criminal.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentListResponseDTO {

    private Long id;

    private LocalDateTime date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String activity;

    private Integer max_capacity;

    private Integer participantsCount;

    private AppointmentListResponseDTO() {}
}
