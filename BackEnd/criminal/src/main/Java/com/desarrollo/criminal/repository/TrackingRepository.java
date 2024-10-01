package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desarrollo.criminal.entity.tracking.Tracking;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackingRepository extends JpaRepository<Tracking, Long>{

}
