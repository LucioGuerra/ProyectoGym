package com.desarrollo.criminal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetActivityDTO {

    private Long id;
    private String name;
    private String description;
    private float price;

    private GetActivityDTO() {
    }
}
