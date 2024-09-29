package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PackageDTO {
    @Size(max = 50)
    private String name;

    @Size(max = 150)
    private String description;

    @NotNull(message = "credits must not be null")
    private Integer credits;

    @NotNull(message = "userId must not be null")
    private Long userId;

    @NotEmpty(message = "activities must not be empty")
    private List<Long> activities;

    private PackageDTO(){
    }
}
