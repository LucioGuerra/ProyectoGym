package com.desarrollo.criminal.service;

import com.desarrollo.criminal.entity.tracking.Tracking;
import com.desarrollo.criminal.repository.TrackingRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class TrackingService {
    private final TrackingRepository trackingRepository;

    public void createTracking(Tracking tracking){
        trackingRepository.save(tracking);
    }

    public void deleteTracking(Long id){
        trackingRepository.deleteById(id);
    }

    public void updateTracking(Long id, Tracking tracking){
    }

}
