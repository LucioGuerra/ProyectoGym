import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CarouselComponent} from "../carousel/carousel.component";
import {MatCardModule} from "@angular/material/card";
import {CarouselItemDirective} from "../carousel/carousel-item.directive";
import {Announcement} from "../models";
import {AnnouncementService} from "../services/services";
import {MatDialog} from "@angular/material/dialog";
import {AnnouncementDialogComponent} from "../announcement-dialog/announcement-dialog.component";

@Component({
  selector: 'app-announcement-carousel',
  standalone: true,
  imports: [
    CarouselComponent,
    MatCardModule,
    CarouselItemDirective
  ],
  templateUrl: './announcement-carousel.component.html',
  styleUrl: './announcement-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementCarouselComponent implements OnInit{

  announcements: Announcement[] = [];

  constructor(private announcementService: AnnouncementService, private dialog: MatDialog) {}

  ngOnInit() {
    this.announcements = this.announcementService.getAnnouncements();
  }

  public open(announcement: Announcement) {
    this.dialog.open(AnnouncementDialogComponent, {
      data: {
        title: announcement.title,
        body: announcement.body,
        date: announcement.date
      },
      disableClose: true
    })
  };
}
