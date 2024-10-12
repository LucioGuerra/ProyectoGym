package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ActivityUpdateDTO {
    @Size(min = 1, max = 20, message = "Activity name must be between 1 and 20 characters.")
    private String name;

    @Size(max = 100, message = "Activity description must have a maximum of 100 characters.")
    private String description;

    @Digits(integer = 6, fraction = 2, message = "Price must have a maximum of 6 integer digits and 2 decimal digits.")
    @PositiveOrZero(message = "Price cannot be negative.")
    private float price;

    private ActivityUpdateDTO() {
    }
}
