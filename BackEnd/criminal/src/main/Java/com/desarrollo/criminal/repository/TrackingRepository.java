package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desarrollo.criminal.entity.tracking.Tracking;

public interface TrackingRepository extends JpaRepository<Tracking, Long>{

}
