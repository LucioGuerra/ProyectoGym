package com.desarrollo.criminal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class GetRandomPackageDTO {

    private String name;
    private String description;
    private Float price;
    private List<String> activities;

    private GetRandomPackageDTO(){

    }
}
