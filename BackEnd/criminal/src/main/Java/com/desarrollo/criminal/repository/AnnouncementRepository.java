package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desarrollo.criminal.entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long>{

}
