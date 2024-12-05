package com.desarrollo.criminal.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class GetAppointmentKineDTO {
    private Long id;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String kineDni;

    private GetUserKineDTO user;
}
