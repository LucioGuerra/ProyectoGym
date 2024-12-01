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
    const announcements: Announcement[] = [
      {
        id: 1,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 2,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 3,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 4,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 5,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 6,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 7,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 8,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 9,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      },
      {
        id: 10,
        title: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur',
        date: new Date()
      }
    ]
    return announcements
    /*return this.http.get<Announcement[]>(this.apiUrl);*/
  }

  deleteAnnouncement(id: number) {

  }
}
