package com.desarrollo.criminal.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@AllArgsConstructor
@Service
public class TrackingService {
    private final TrackingRepository trackingRepository;

    public void createTracking(Tracking tracking){
        trackingRepository.saved(tracking);
    }

    public void deleteTracking(Long id){
        trackingRepository.deleteById(id);
    }

    public void updateTracking(Long id, Tracking tracking){
    }

}
