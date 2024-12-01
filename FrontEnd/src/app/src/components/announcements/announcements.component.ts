import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AnnouncementService } from '../services/services';
import { DrawerComponent } from '../drawer/drawer.component';
import { MatDivider } from '@angular/material/divider';
import { MatActionList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';

interface Announcement {
  id: any;
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDivider, MatActionList, DrawerComponent],
  providers: [provideNativeDateAdapter()],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss'
})
export class AnnouncementsComponent {
  announcements: any[] = [];

  constructor(private announcementService: AnnouncementService, private router: Router) { }

  ngOnInit() {
    this.announcements = this.announcementService.getAnnouncements();
    /*this.announcementService.getAnnouncements().subscribe({
      next: (announcements: any) => {
        this.announcements = announcements.map((announcements: any) => ({
          id: announcements.id,
          title: announcements.title,
          description: announcements.description,
          date: new Date(announcements.date).toLocaleDateString('es-AR')
        }));
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });*/
  }

  deleteAnnouncement(id: number) {
    /*this.announcementService.deleteAnnouncement(id).subscribe(() => {
      this.announcements = this.announcements.filter(
        (announcement: any) => announcement.id !== id
      );
    });*/
  }

  updateAnnouncement(id: any) {
    this.router.navigate(['/update-announcement', id]);
  }
}
