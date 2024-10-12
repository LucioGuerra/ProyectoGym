package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.entity.user.UserXAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserXAppointmentRepository extends JpaRepository<UserXAppointment, Long> {
    void deleteByAppointmentAndUser(Appointment appointment, User user);
}
