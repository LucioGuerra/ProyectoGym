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

import com.desarrollo.criminal.dto.request.AnnouncementDTO;
import com.desarrollo.criminal.entity.Announcement;
import com.desarrollo.criminal.service.AnnouncementService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController{

    private final AnnouncementService announcementService;


    @PostMapping
    public ResponseEntity<com.desarrollo.criminal.dto.request.AnnouncementDTO> createAnnouncement(@Valid @RequestBody AnnouncementDTO announcementDTO){

        return announcementService.createAnnouncement(announcementDTO);
    }


    @GetMapping
    public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncement(){
        return announcementService.getAllAnnouncement();
    }


    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Long id){
        return announcementService.getAnnouncementById(id);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id){
        return announcementService.deleteAnnouncement(id);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody AnnouncementDTO announcementDTO){
        return announcementService.updateAnnouncement(id, announcementDTO);
    }
    
}