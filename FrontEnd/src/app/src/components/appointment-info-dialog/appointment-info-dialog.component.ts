import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {Appointment, AppointmentUser} from "../models";
import {AppointmentService, AuthService} from "../services/services";
import {AsyncPipe, DatePipe, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

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
  isReserved = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<AppointmentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, isAdmin: boolean },
    private appointmentService: AppointmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService,
  ) {
    this.loadAppointment();
  }

  loadAppointment(): void {
    this.appointmentService.getAppointmentById(this.data.id).subscribe({
      next: (appointment: Appointment) => {
        this.loading = false;
        this.appointmentData = appointment;
        this.changeDetectorRef.markForCheck();
        console.log('users: ', this.appointmentData.participants);
        console.log('isAdmin? ', this.data.isAdmin);
      },
      error: (error: any) => {
        this.loading = false;
        this.onClose();
      }
    });
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
    this.appointmentService.switchUserAttendance(this.data.id, participant.id, !participant.attendance).subscribe(
      () => {
        this.changeDetectorRef.markForCheck();
        participant.attendance = !participant.attendance;
      },
      (error: any) => {
        console.error('Error al cambiar la asistencia del usuario', error);
      }
    );
  }

  isUserInAppointment() {
    console.log('userInfo: ', this.auth.userInfo());
    this.isReserved.set(!this.isReserved());
    /*return this.appointmentData!.participants!.some(user => user.id === this.auth.userInfo.);*/
  }
}
