package com.desarrollo.criminal.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.desarrollo.criminal.dto.response.GetAnnouncementDTO;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
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

        Announcement announcement = modelMapper.map(announcementDTO, Announcement.class);
        Announcement savedAnnouncement = announcementRepository.save(announcement);

        AnnouncementDTO responseDTO = modelMapper.map(savedAnnouncement, AnnouncementDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

    }



    public ResponseEntity<List<GetAnnouncementDTO>> getAllAnnouncement(){

        List<Announcement> announcements = announcementRepository.findAll();

        List<GetAnnouncementDTO> announcementsDTO = announcements
                .stream()
                .map(announcement -> modelMapper.map(announcement, GetAnnouncementDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(announcementsDTO);
    }



    public ResponseEntity<GetAnnouncementDTO> getAnnouncementDTOById(Long id){

        Announcement announcement = this.getAnnouncementById(id);

        GetAnnouncementDTO announcementDTO = modelMapper.map(announcement, GetAnnouncementDTO.class);
        return ResponseEntity.status(HttpStatus.OK).body(announcementDTO);
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

        Announcement announcement = this.getAnnouncementById(id);

        announcement.setTitle(newAnnouncementDTO.getTitle());
        announcement.setBody(newAnnouncementDTO.getBody());

        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        AnnouncementDTO announcementDTO = modelMapper.map(updatedAnnouncement, AnnouncementDTO.class);

        return ResponseEntity.status(HttpStatus.OK).body(announcementDTO);
    }


    private Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Announcement not found"));
    }

}
