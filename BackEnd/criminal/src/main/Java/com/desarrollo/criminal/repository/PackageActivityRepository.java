package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.PackageActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageActivityRepository extends JpaRepository<PackageActivity, Long> {
}
