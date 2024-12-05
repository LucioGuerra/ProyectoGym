package com.desarrollo.criminal.controller;

import java.util.List;

import com.desarrollo.criminal.dto.response.GetAnnouncementDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping("/admin")
    public ResponseEntity<com.desarrollo.criminal.dto.request.AnnouncementDTO> createAnnouncement(@Valid @RequestBody AnnouncementDTO announcementDTO){
        return announcementService.createAnnouncement(announcementDTO);
    }


    @GetMapping
    public ResponseEntity<List<GetAnnouncementDTO>> getAllAnnouncement(){
        return announcementService.getAllAnnouncement();
    }


    @GetMapping("/admin/{id}")
    public ResponseEntity<GetAnnouncementDTO> getAnnouncementById(@PathVariable Long id){
        return announcementService.getAnnouncementDTOById(id);
    }


    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id){
        return announcementService.deleteAnnouncement(id);
    }


    @PutMapping("/admin/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody AnnouncementDTO announcementDTO){
        return announcementService.updateAnnouncement(id, announcementDTO);
    }

}