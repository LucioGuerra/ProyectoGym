package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.Activity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentDTO {
    @NotNull(message = "The date is required")
    @FutureOrPresent(message = "The date must be in the present or future")
    private LocalDate date;

    @NotNull(message = "The start time is required")
    private LocalTime startTime;

    @NotNull(message = "The end time is required")
    private LocalTime endTime;

    @NotNull(message = "The activity is required")
    private long activityID;

    private long instructorID;

    private AppointmentDTO() {}

}