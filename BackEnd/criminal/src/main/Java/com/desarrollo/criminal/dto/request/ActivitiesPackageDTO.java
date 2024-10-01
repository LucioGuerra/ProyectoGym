package com.desarrollo.criminal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

@Setter
@Getter
@AllArgsConstructor
public class ActivitiesPackageDTO {

    @NotNull(message = "activityId must not be null")
    private Long activityId;

    @NotNull(message = "quantity must not be null")
    @Range(min = 1, max = 21, message = "quantity must be between 1 and 21")
    private Integer quantity;

    private ActivitiesPackageDTO(){
    }
}
