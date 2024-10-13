package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.desarrollo.criminal.entity.Package;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long>{

    @Query("SELECT p FROM Package p WHERE p.expirationDate <= CURRENT_DATE AND p.active = true")
    List<Package> findExpiredTodayAndActive();

    List<Package> findByUser(User user);

    Optional<Package> findByUserIdAndActiveTrue(Long userId);
}
