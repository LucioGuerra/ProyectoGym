package com.desarrollo.criminal.dto.response;

import com.desarrollo.criminal.entity.Activity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GetPackageDTO {
    private String name;
    private String description;
    private Integer credits;
    private LocalDate expirationDate;
    private Long userId;
    private List<String> activities;

    private GetPackageDTO(){
    }
}
