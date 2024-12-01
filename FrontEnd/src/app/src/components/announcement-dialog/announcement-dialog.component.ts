import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
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

@Component({
  selector: 'app-announcement-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './announcement-dialog.component.html',
  styleUrl: './announcement-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementDialogComponent {

  announcement: Announcement | undefined;

  constructor(
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogId: number },
    private announcementService: AnnouncementService,
  ) {
    this.loadAnnouncement();
  }

  private loadAnnouncement() {
    this.announcementService.getAnnouncementById(this.data.dialogId).subscribe({
      next: (announcement: Announcement) => {
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
