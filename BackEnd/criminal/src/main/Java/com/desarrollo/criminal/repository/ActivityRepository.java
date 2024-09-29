package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("SELECT a FROM Activity a WHERE a.id IN :ids")
    Set<Activity> findAllById(List<Long> ids);
}
