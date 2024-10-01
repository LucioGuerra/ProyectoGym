package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class UpdatePackageDTO {

    @Size(max = 50, message = "name must not be greater than 50 characters")
    private String name;

    @Size(max = 150, message = "description must not be greater than 150 characters")
    private String description;

    private Integer credits;

    private List<Long> activities;

    @Future(message = "expiration date must be in the future")
    private LocalDate expirationDate;

    private UpdatePackageDTO(){
    }

}
