package com.desarrollo.criminal.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class GetRandomPackageDTO {
    private String name;
    private String description;
    private Float price;
    private List<String> activities;
}
