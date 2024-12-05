package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.PackageActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PackageActivityRepository extends JpaRepository<PackageActivity, Long> {
    @Query("SELECT pa FROM PackageActivity pa WHERE pa.activity.id = :activityId AND pa.aPackage.id = :packageId")
    Optional<PackageActivity> findPackageActivityByActivityIdAndAPackageId(@Param("activityId") Long id,
                                                                           @Param("packageId") Long id1);
}
