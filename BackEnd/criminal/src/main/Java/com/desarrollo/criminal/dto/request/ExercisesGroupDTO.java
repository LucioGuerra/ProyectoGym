package com.desarrollo.criminal.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Duration;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class ExercisesGroupDTO {
    private String title;
    private List<ExerciseRepsDTO> exercises;
    private Duration duration;
}