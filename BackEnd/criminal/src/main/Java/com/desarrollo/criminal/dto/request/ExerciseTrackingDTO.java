package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
public class ExerciseTrackingDTO {

    @NotNull(message = "Weight is required")
    @PositiveOrZero(message = "Weight must be positive")
    private Double weight;

    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date can not be in the future")
    private Date date;

    @NotNull(message = "ExerciseID is required")
    private Long ExerciseID;
}
