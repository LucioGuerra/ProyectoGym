import {ChangeDetectionStrategy, Component, Inject, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { Announcement, AnnouncementService } from '..';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-announcement-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatProgressSpinnerModule
  ],
  templateUrl: './announcement-dialog.component.html',
  styleUrl: './announcement-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementDialogComponent {

  announcement: Announcement = {
    id: 0,
    title: '',
    body: '',
    date: new Date(),
  };
  isLoading = signal<boolean>(true);

  constructor(
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { announcementId: number },
    private announcementService: AnnouncementService,
  ) {
    this.loadAnnouncement();
  }

  private loadAnnouncement() {
    this.announcementService.getAnnouncementById(this.data.announcementId).subscribe({
      next: (announcement: Announcement) => {
        this.isLoading.set(false)
        this.announcement = {
          ...announcement,
          date: new Date(announcement.date)
        };
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
