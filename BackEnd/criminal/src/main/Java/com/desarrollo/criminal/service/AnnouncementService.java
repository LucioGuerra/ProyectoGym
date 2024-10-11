package com.desarrollo.criminal.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.desarrollo.criminal.dto.request.AnnouncementDTO;
import com.desarrollo.criminal.entity.Announcement;
import com.desarrollo.criminal.repository.AnnouncementRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final ModelMapper modelMapper;


    public ResponseEntity<AnnouncementDTO> createAnnouncement(AnnouncementDTO announcementDTO){

        try {
            Announcement announcement = modelMapper.map(announcementDTO, Announcement.class);
            Announcement savedAnnouncement = announcementRepository.save(announcement);
    
            AnnouncementDTO responseDTO = modelMapper.map(savedAnnouncement, AnnouncementDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        
    
            } catch (MappingException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
    }



    public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncement(){

        List<Announcement> announcements = announcementRepository.findAll();

        List<AnnouncementDTO> announcementsDTO = announcements
            .stream()
            .map(announcement -> modelMapper.map(announcement, AnnouncementDTO.class))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.OK).body(announcementsDTO);
    }



    public ResponseEntity<AnnouncementDTO> getAnnouncementById(Long id){

        Optional<Announcement> optionalAnnouncement = announcementRepository.findById(id);

        if (optionalAnnouncement.isPresent()) {

            Announcement announcement = optionalAnnouncement.get();
            AnnouncementDTO announcementDTO = modelMapper.map(announcement, AnnouncementDTO.class);
            return ResponseEntity.status(HttpStatus.OK).body(announcementDTO);
        
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



    public ResponseEntity<Void> deleteAnnouncement(Long id){
        Optional<Announcement> announcement = announcementRepository.findById(id);

        if (announcement.isPresent()) {
            announcementRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    public ResponseEntity<AnnouncementDTO> updateAnnouncement(Long id, AnnouncementDTO newAnnouncementDTO){

        Optional<Announcement> optionalAnnouncement = announcementRepository.findById(id);

        if (optionalAnnouncement.isPresent()) {
            
            Announcement announcement = optionalAnnouncement.get();

            announcement.setTitle(newAnnouncementDTO.getTitle());
            announcement.setBody(newAnnouncementDTO.getBody());

            Announcement updatedAnnouncement = announcementRepository.save(announcement);
            AnnouncementDTO announcementDTO = modelMapper.map(updatedAnnouncement, AnnouncementDTO.class);

            return ResponseEntity.status(HttpStatus.OK).body(announcementDTO);

        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
    }

}
