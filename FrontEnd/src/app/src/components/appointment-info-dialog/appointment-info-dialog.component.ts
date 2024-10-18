import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, signal} from '@angular/core';
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
import {UserService} from "../services/services/user.service";

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
export class AppointmentInfoDialogComponent implements OnInit {
  loading = true;
  appointmentData: Appointment | undefined;
  isReserved = signal<boolean>(false);
  isFull = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<AppointmentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, isAdmin: boolean },
    private appointmentService: AppointmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.loadAppointment();
    this.appointmentService.appointmentChanged$.subscribe(() => {
      this.loadAppointment();
    });
  }

  loadAppointment(): void {
    this.appointmentService.getAppointmentById(this.data.id).subscribe({
      next: (appointment: Appointment) => {
        this.loading = false;
        this.appointmentData = appointment;
        this.userService.getUserByEmail(this.auth.userInfo().email).subscribe(user => {
          this.isReserved.set(appointment.participants!.some(participant => participant.id === user.id));
          console.log('isReserved? ', this.isReserved());
        });
        this.changeDetectorRef.markForCheck();
        console.log('users: ', this.appointmentData.participants);
        console.log('isAdmin? ', this.data.isAdmin);
        console.log("participants: ", this.appointmentData.participants);
        console.log("max_capacity: ", this.appointmentData.max_capacity);
        if(this.appointmentData.participants!.length >= this.appointmentData.max_capacity) {
          this.isFull.set(true);
        }else {
          this.isFull.set(false);
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.onClose();
      }
    });
  }

  onClose(): void {
    this.dialogRef.close(true);
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
      (response) => {
        console.log('Asistencia cambiada', response);
        this.changeDetectorRef.markForCheck();
        participant.attendance = response;
      },
      (error: any) => {
        console.error('Error al cambiar la asistencia del usuario', error);
      }
    );
  }

  isUserInAppointment() {
    console.log('userInfo: ', this.auth.userInfo());
    this.changeDetectorRef.markForCheck();
    if (this.isReserved()) {
      // Llamada para des-reservar (unreserve)
      this.appointmentService.unreserveAppointment(this.data.id, this.auth.userInfo().email).subscribe({
        next: () => {
          console.log('Cita des-reservada');
          this.loadAppointment();
          this.appointmentService.notifyAppointmentChanged();
        },
        error: (error: any) => {
          console.error('Error al des-reservar la cita', error);
        }
      });
    } else {
      this.appointmentService.reserveAppointment(this.data.id, this.auth.userInfo().email).subscribe({
        next: () => {
          console.log('Cita reservada');
          this.loadAppointment();
          this.appointmentService.notifyAppointmentChanged();
        },
        error: (error: any) => {
          console.error('Error al reservar la cita', error);
        }
      });
    }
  }
}
