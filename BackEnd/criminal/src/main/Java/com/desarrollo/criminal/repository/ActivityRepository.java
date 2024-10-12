package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Query("SELECT a FROM Activity a WHERE a.softDelete = false")
    List<Activity> findAllNotDeleted();

    @Query("SELECT a FROM Activity a WHERE a.id = :id AND a.softDelete = false")
    Optional<Activity> findByIdAndNotDeleted(Long id);

    Optional<Activity> findByName(String name);
}
