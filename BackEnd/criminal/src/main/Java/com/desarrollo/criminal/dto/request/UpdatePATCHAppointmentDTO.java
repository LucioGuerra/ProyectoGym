package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class UpdatePATCHAppointmentDTO {

    @FutureOrPresent(message = "The date must be in the attendance or future")
    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private Long activityID;

    private Integer max_capacity;

    private Long instructorID;

    @NotNull(message = "The field updateAllFutureAppointments is required")
    private Boolean updateAllFutureAppointments;

    private UpdatePATCHAppointmentDTO() {}
}

