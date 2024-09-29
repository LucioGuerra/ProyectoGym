package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desarrollo.criminal.entity.Package;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package, Long>{

    @Query("SELECT p FROM Package p WHERE p.expirationDate = CURRENT_DATE")
    List<Package> findExpiredToday();

}
