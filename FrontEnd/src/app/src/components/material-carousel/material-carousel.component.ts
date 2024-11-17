import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Announcement } from '../models';
import { AnnouncementDialogComponent } from '../announcement-dialog/announcement-dialog.component';
import { AnnouncementService } from '..';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-material-carousel',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, NgForOf],
  templateUrl: './material-carousel.component.html',
  styleUrl: './material-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialCarouselComponent {

  selectedIndex = 0;
  announcements: Announcement[] = [];

  constructor(private announcementService: AnnouncementService, private dialog: MatDialog) {}

  ngOnInit() {
    this.announcements = this.announcementService.getAnnouncements();
  }

  prevSlide() {
    // Ir al slide anterior
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  nextSlide() {
    // Ir al siguiente slide
    if (this.selectedIndex < this.announcements.length - 1) {
      this.selectedIndex++;
    }
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