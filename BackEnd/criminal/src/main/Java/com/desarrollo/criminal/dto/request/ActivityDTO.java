package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ActivityDTO {

    @NotBlank(message = "Activity name cannot be empty.")
    @Size(min = 1, max = 20, message = "Activity name must be between 1 and 20 characters.")
    private String name;

    @Size(max = 100, message = "Activity description must have a maximum of 100 characters.")
    private String description;

    @NotNull(message = "Price cannot be null.")
    @Digits(integer = 6, fraction = 2, message = "Price must have a maximum of 6 integer digits and 2 decimal digits.")
    @PositiveOrZero(message = "Price cannot be negative.")
    private float price;

    private ActivityDTO(){

    }
}