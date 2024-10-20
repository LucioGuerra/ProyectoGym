package com.desarrollo.criminal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desarrollo.criminal.entity.Announcement;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long>{

}
