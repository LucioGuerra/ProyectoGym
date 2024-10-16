package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.PackageActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PackageActivityRepository extends JpaRepository<PackageActivity, Long> {
    Optional<PackageActivity> findPackageActivityByActivity_IdAndAPackage_Id(Long activityId, Long packageId);
}
