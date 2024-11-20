import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity, Announcement } from '../models';
import { AnnouncementService } from '..';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-activity-carousel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
  ],
  templateUrl: './activity-carousel.component.html',
  styleUrl: './activity-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCarouselComponent {
  
  @Input() activities: Activity[] = [];
  
  selectedIndex = 0;
  announcements: Announcement[] = [];

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit() {
    this.announcements = this.announcementService.getAnnouncements();
  }

  prevSlide() {
    // Ir al slide anterior
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.announcements.length - 1;
    }
  }

  nextSlide() {
    // Ir al siguiente slide
    if (this.selectedIndex < this.announcements.length - 1) {
      this.selectedIndex++;
    }
    if (this.selectedIndex === this.announcements.length - 1) {
      this.selectedIndex = 0;
    }
  }
}
