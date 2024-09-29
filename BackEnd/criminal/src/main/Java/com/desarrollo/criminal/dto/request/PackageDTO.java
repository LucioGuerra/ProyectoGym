package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.Activity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class PackageDTO {
    @Size(max = 50, message = "name must not be greater than 50 characters")
    private String name;

    @Size(max = 150, message = "description must not be greater than 150 characters")
    private String description;

    @NotNull(message = "userId must not be null")
    private Long userId;

    @NotEmpty(message = "activities must not be empty")
    @Valid
    private Set<ActivitiesPackageDTO> activities;

    private PackageDTO(){
    }
}
