package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.tracking.DateWeight;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class TrackingDTO {
    private List<DateWeight> dateWeight;
    private Long exerciseID;
}
