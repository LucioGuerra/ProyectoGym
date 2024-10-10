package com.desarrollo.criminal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GetPackageDTO {
    private String name;
    private String description;
    private Float price;
    private LocalDate expirationDate;
    private LocalDate createdAt;
    private Long userId;
    private List<GetPackageActivityDTO> activities;

    private GetPackageDTO(){
    }
}