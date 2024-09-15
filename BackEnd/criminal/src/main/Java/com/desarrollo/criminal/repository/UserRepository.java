package com.desarrollo.criminal.repository;

import com.desarrollo.criminal.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
