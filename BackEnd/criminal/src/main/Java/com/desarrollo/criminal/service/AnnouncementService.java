package com.desarrollo.criminal.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.desarrollo.criminal.entity.Announcement;
import com.desarrollo.criminal.repository.AnnouncementRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    public ResponseEntity<Announcement> createAnnouncement(Announcement announcement){
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAnnouncement);
    }

    public ResponseEntity<List<Announcement>> getAllAnnouncement(){
        List<Announcement> announcements = announcementRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(announcements);
    }

    public ResponseEntity<Announcement> getAnnouncementById(Long id){
        Announcement announcement = announcementRepository.findById(id).get();
        return ResponseEntity.status(HttpStatus.OK).body(announcement);
    }

    public ResponseEntity<Announcement> deleteAnnouncement(Long id){
        announcementRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<Announcement> updateAnnouncement(Long id, Announcement newAnnouncement){
        Announcement announcement = announcementRepository.findById(id).get();
        //Reemplazar los valores de announcement por los de newAnnouncement
        announcementRepository.save(announcement);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
