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
import {map} from "rxjs/operators";
import {Observable, startWith} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-appointment-info-dialog',
  standalone: true,
  imports: [
    MatLabel,
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
    MatFormField,
    MatAutocomplete,
    MatOption,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatInput,
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

  isKinesiology = signal<boolean>(false);

  //para la busqueda de kinesiologo
  kinesiologoControl = new FormControl('');
  kinesiologosOptions = [
    {
      "id": 1,
      "name": "Kinesiologo 1",
      "bodyParts": [1, 2, 3, 8], // IDs de "Cuello", "Hombros", "Espalda", "Manos"
    }
  ];
  filteredKinesiologosOptions: Observable<string[]> | undefined;

  //para la busqueda de partes del cuerpo
  bodyPartControl = new FormControl('');
  bodyPartOptions = [
    { "id": 1, "name": "Cuello" },
  ];
  filteredBodyPartOptions: Observable<string[]> | undefined;


  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().includes(filterValue));
  }



  constructor(
    public dialogRef: MatDialogRef<AppointmentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, isAdmin: boolean },
    private appointmentService: AppointmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    try {
      await this.loadAppointment();

      this.appointmentService.appointmentChanged$.subscribe(() => {
        this.loadAppointment();
      });

      if (this.isKinesiology()) {
        await Promise.all([
          await this.loadBodyParts(),
          await this.loadKinesiologyInstructors()
        ]);

        // Filtro de kinesiologo
        this.filteredKinesiologosOptions = this.kinesiologoControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '', this.kinesiologosOptions.map(kinesiologo => kinesiologo.name))),
        );

        // Filtro de partes del cuerpo
        this.filteredBodyPartOptions = this.bodyPartControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '', this.bodyPartOptions.map(bodyPart => bodyPart.name))),
        );

        // Filtrar kinesiologo basado en partes del cuerpo
        this.bodyPartControl.valueChanges.subscribe((bodyPart) => {
          if (bodyPart) {
            this.kinesiologoControl.setValue('');
            this.filteredKinesiologosOptions = this.kinesiologoControl.valueChanges.pipe(
              startWith(''),
              map(value => {
                const filteredKinesiologos = this.kinesiologosOptions.filter(kinesiologo =>
                  kinesiologo.bodyParts.includes(this.bodyPartOptions.find(part => part.name === bodyPart)?.id || 0)
                );
                return this._filter(value || '', filteredKinesiologos.map(kinesiologo => kinesiologo.name));
              })
            );
          }
        });
      }
    } catch (error) {
      console.error('Error during initialization', error);
    }
  }

  loadAppointment(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.appointmentService.getAppointmentById(this.data.id).subscribe({
        next: (appointment: Appointment) => {
          this.loading = false;
          this.appointmentData = appointment;
          this.isKinesiology.set(this.appointmentData.activity === 'Kinesiology' || this.appointmentData.activity === 'Kinesiologia');
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
          resolve();
        },
        error: (error: any) => {
          this.loading = false;
          this.onClose();
          reject(error);
        }
      });
    });
  }

  loadKinesiologyInstructors(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getKinesioUsers().subscribe({
        next: (kinesiologos: any[]) => {
          this.kinesiologosOptions = kinesiologos;
          this.changeDetectorRef.markForCheck();
          resolve();
        },
        error: (error: any) => {
          console.error('Error al cargar los kinesiologos', error);
          reject(error);
        }
      });
    });
  }

  loadBodyParts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getBodyParts().subscribe({
        next: (bodyParts: any[]) => {
          this.bodyPartOptions = bodyParts;
          this.changeDetectorRef.markForCheck();
          resolve();
        },
        error: (error: any) => {
          console.error('Error al cargar las partes del cuerpo', error);
          reject(error);
        }
      });
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
    this.appointmentService.switchUserAttendance(this.data.id, participant.id).subscribe(
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

  addUserToKineAppointment() {
    this.appointmentService.addUserToKinesiologyAppointment(
      this.data.id,
      this.auth.userInfo().email,
      this.kinesiologosOptions.filter(kinesiologo => kinesiologo.name === this.kinesiologoControl.value)[0].id
    ).then((observable) => {
      observable.subscribe(() => {
        this.loadAppointment();
      });
    });
  }
}
