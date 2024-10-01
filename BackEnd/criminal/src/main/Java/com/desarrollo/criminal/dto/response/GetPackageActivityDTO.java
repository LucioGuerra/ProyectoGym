package com.desarrollo.criminal.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetPackageActivityDTO {

    private String name;
    private Integer quantity;

    private GetPackageActivityDTO(){
    }
}
