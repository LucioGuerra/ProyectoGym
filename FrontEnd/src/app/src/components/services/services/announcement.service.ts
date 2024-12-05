import { Injectable } from '@angular/core';
import {environment} from "../../../../../environments";
import {HttpClient} from "@angular/common/http";
import {Announcement} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = `${environment.apiUrl}/announcements`;

  constructor(private http: HttpClient) {}

  getAnnouncements() {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  getAnnouncementById(id: number) {
    return this.http.get<Announcement>(`${this.apiUrl}/admin/${id}`);
  }

  updateAnnouncement(announcementID: number, announcement: Announcement) {
    const announcementSend = {
      ...announcement,
      date: this.dateAdapt(announcement.date)
    };
    return this.http.put<Announcement>(`${this.apiUrl}/admin/${announcementID}`, announcement);      
  }

  deleteAnnouncement(id: number) {
    return this.http.delete(`${this.apiUrl}/admin/${id}`);
  }

  createAnnouncement(announcement: Announcement) {
    const announcementSend = {
      ...announcement,
      date: this.dateAdapt(announcement.date)
    };
    return this.http.post<Announcement>(`${this.apiUrl}/admin`, announcement);
  }

  private dateAdapt(date: Date): string {
    return date.toLocaleString("es-AR").split(",")[0].split('/').map(part => part.length === 1 ? '0' + part : part).reverse().join('-');
  }
}
