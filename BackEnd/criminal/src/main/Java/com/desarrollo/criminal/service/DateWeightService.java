package com.desarrollo.criminal.service;

import com.desarrollo.criminal.entity.tracking.DateWeight;
import com.desarrollo.criminal.repository.DateWeightRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@AllArgsConstructor
public class DateWeightService {
    private final DateWeightRepository dateWeightRepository;

    public DateWeight createDateWeight(Double weight, Date date) {
        DateWeight dateWeight = new DateWeight();
        dateWeight.setWeight(weight);
        dateWeight.setDate(date);
        return dateWeightRepository.save(dateWeight);
    }
}
