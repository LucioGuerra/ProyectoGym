package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.tracking.DateWeight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DateWeightRepository extends JpaRepository<DateWeight, Long> {
}
