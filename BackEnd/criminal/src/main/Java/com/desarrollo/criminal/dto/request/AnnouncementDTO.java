package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.*;
import lombok.Setter;
import lombok.Getter;
import lombok.AllArgsConstructor;
import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
public class AnnouncementDTO {

    @NotBlank(message = "Title cannot be blank.")
    @Size(min = 1, max = 50, message = "Title must be between 1 and 50 characters.")
    private String title;

    @NotBlank(message = "Body cannot be blank.")
    private String body;

    @NotNull(message = "Date cannot be null.")
    @FutureOrPresent(message = "Date must be in the present or future")
    private LocalDate date;

    public AnnouncementDTO(){}

}
