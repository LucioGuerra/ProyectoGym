import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './material-carousel.component.html',
  styleUrl: './material-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialCarouselComponent {

  selectedIndex = 0;
  announcements = signal<Announcement[]>([]);

  constructor(private announcementService: AnnouncementService, private dialog: MatDialog) {}

  ngOnInit() {
    this.announcementService.getAnnouncements().subscribe({
      next: (announcementss: any) => {
        this.announcements.set(announcementss.map((announcement: any) => ({
          ...announcement,
          date: new Date(announcement.date).toLocaleDateString('es-AR')
        })));
        console.log('anuncios: ',this.announcements());
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  prevSlide() {
    // Ir al slide anterior
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  nextSlide() {
    // Ir al siguiente slide
    console.log('selectedindex: ',this.selectedIndex, );
    if (this.selectedIndex < this.announcements().length - 1) {
      this.selectedIndex++;
    }
  }


  public open(announcement: Announcement) {
    this.dialog.open(AnnouncementDialogComponent, {
      data: {
        announcementId: announcement.id
      },
      disableClose: true
    })
  };
}
