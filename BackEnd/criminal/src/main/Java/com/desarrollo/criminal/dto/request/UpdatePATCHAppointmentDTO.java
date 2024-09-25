package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class UpdatePATCHAppointmentDTO {

    @FutureOrPresent(message = "The date must be in the present or future")
    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private Long activityID;

    private Long instructorID;

    private UpdatePATCHAppointmentDTO() {}
}

