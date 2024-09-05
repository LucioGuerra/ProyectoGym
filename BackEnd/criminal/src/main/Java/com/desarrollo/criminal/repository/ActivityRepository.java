package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
