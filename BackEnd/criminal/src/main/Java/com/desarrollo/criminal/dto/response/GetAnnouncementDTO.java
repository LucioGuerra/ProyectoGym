package com.desarrollo.criminal.dto.response;

import lombok.Data;

@Data
public class GetAnnouncementDTO {
    Long id;
    String title;
    String body;
    String date;
}
