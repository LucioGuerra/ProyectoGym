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
  constructor(
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, body: string, date: string },
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
