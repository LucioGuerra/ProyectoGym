package com.desarrollo.criminal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desarrollo.criminal.entity.Announcement;
import com.desarrollo.criminal.service.AnnouncementService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController{
    private final AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement){
        return announcementService.createAnnouncement(announcement);
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncement(){
        return announcementService.getAllAnnouncement();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@RequestParam Long id){
        return announcementService.getAnnouncementById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Announcement> deleteAnnouncement(@RequestParam Long id){
        return announcementService.deleteAnnouncement(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@RequestParam Long id, @RequestBody Announcement announcement){
        return announcementService.updateAnnouncement(id, announcement);
    }
}