package com.desarrollo.criminal.dto.response;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseActivityDTO {

    private Long id;

    private String name;

    private String description;

    private float price;

}
