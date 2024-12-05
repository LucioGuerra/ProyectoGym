package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.Role;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.entity.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    Optional<User> findByDni(String dni);

    List<User> findAllByRole(Role role);

    @Query("SELECT p FROM User u JOIN u.aPackage p WHERE u.id = :userId AND p.active = true")
    Optional<Package> findActivePackagesByUserId(@Param("userId") Long userId);

    @Query("SELECT ua.appointment " +
            "FROM UserXAppointment ua " +
            "WHERE ua.user.id = :userId " +
            "AND ua.appointment.date <= CURRENT_DATE " +
            "ORDER BY ua.appointment.date DESC, ua.appointment.startTime ASC")
    List<Appointment> findAppointmentsByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM User u JOIN u.aPackage p WHERE u.id = :userId order by p.expirationDate desc")
    List<Package> findPackagesByUserId(@Param("userId") Long id);
}
