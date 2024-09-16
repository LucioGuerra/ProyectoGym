package com.desarrollo.criminal.service;

import com.desarrollo.criminal.entity.tracking.DateWeight;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DateWeightService {


    public DateWeight createDateWeight(Double weight, Date date) {
        DateWeight dateWeight = new DateWeight();
        dateWeight.setWeight(weight);
        dateWeight.setDate(date);
        return dateWeight;
    }
}
