package com.desarrollo.criminal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ActivityDTO {
    private Long id;
    private String name;
    private String description;
    // private List<ActivityRoutineDTO> routines;
}