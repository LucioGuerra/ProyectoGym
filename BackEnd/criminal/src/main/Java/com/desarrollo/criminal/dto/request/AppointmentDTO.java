package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.user.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentDTO {

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Activity activity;
    private User instructor;

    private AppointmentDTO() {}

}
