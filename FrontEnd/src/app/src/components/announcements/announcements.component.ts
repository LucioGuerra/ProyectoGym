import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AnnouncementService } from '../services/services';
import { DrawerComponent } from '../drawer/drawer.component';
import { MatDivider } from '@angular/material/divider';
import { MatActionList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { Announcement } from '../models';
import { MainScreenComponent } from "../../layout/main-screen/main-screen.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementDialogComponent } from '../announcement-dialog/announcement-dialog.component';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatActionList, MainScreenComponent, MatMenuModule, MatIconModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss'
})
export class AnnouncementsComponent {

  announcements: Announcement[] = [];

  constructor(private announcementService: AnnouncementService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.announcementService.getAnnouncements().subscribe({
      next: (announcements: any) => {
        this.announcements = announcements.map((announcement: any) => ({
          ...announcement,
          date: new Date(announcement.date)
        }));
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  openAnnouncement(id: any, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.dialog.open(AnnouncementDialogComponent, {data: {announcementId: id}});
  }

  deleteAnnouncement(id: number, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.announcementService.deleteAnnouncement(id).subscribe(() => {
      this.loadAnnouncements();
    });
  }

  updateAnnouncement(id: any, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.router.navigate(['/admin/announcements/edit', id]);
  }

  openMenu($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  volver() {
    window.history.back();
  }

  create() {
    this.router.navigate(['/admin/announcements/create']);
  }
}