package com.desarrollo.criminal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
public class ExerciseTrackingDTO {
    private Double weight;
    private Date date;
    private Long ExerciseID;
}