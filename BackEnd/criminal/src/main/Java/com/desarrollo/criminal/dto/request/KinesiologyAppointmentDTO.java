package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class KinesiologyAppointmentDTO {
    @NotNull(message = "The date is required")
    @FutureOrPresent(message = "The date must be in the present or future")
    private LocalDate date;

    @NotNull(message = "The start date is required")
    @FutureOrPresent(message = "The date must be in the present or future")
    private LocalDate endDate;

    @NotNull(message = "The start time is required")
    private LocalTime startTime;

    @NotNull(message = "The end time is required")
    private LocalTime endTime;

    @NotNull(message = "The quantity is required")
    @Positive(message = "The quantity must be greater than zero")
    private Integer appointmentQuantity;

    @NotNull(message = "The appointment week days are required")
    private List<DayOfWeek> appointmentWeekDays;

    private KinesiologyAppointmentDTO() {}
}
