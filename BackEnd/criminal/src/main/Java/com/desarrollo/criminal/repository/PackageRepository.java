package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desarrollo.criminal.entity.Package;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long>{

    @Query("SELECT p FROM Package p WHERE p.expirationDate = CURRENT_DATE")
    List<Package> findExpiredToday();

}
