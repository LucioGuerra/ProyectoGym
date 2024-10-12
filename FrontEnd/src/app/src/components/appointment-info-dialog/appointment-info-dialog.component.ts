import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import {Appointment, AppointmentUser} from "../models";
import {AppointmentService} from "../services/services";
import {AsyncPipe, DatePipe, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-info-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    AsyncPipe,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './appointment-info-dialog.component.html',
  styleUrls: ['./appointment-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfoDialogComponent {
  loading = true;
  appointmentData: Appointment | undefined;

  constructor(
    public dialogRef: MatDialogRef<AppointmentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private appointmentService: AppointmentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.loadAppointment();
  }

  loadAppointment(): void {
    this.appointmentService.getAppointmentById(this.data.id).subscribe(
      (appointment: Appointment) => {
        this.loading = false;
        this.appointmentData = appointment;
        this.changeDetectorRef.markForCheck();
      },
      (error: any)  => {
        this.loading = false;
        this.onClose();
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  toggleAttendance(participant: AppointmentUser): void {
    participant.attended = !participant.attended;
  }
}
