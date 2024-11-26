import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogConfig,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {Appointment, AppointmentUser, BodyPart, KineModel} from "../models";
import {AppointmentService, AuthService} from "../services/services";
import {AsyncPipe, DatePipe, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {UserService} from "../services/services/user.service";
import {map} from "rxjs/operators";
import {Observable, startWith} from "rxjs";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";
import {MatError} from "@angular/material/form-field";
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';
import { KinesiologyIntegrationService } from '../services/kinesiology/kinesiology-integration.service';

@Component({
  selector: 'app-appointment-info-dialog',
  standalone: true,
  imports: [
    MatError,
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
  kinesiologoControl = new FormControl('', Validators.required);
  kinesiologosOptions: KineModel[] = [];
  filteredKinesiologosOptions: Observable<string[]> | undefined;

  //para la busqueda de partes del cuerpo
  bodyPartControl = new FormControl('');
  bodyPartOptions = [
    {"id": 1, "name": "Cuello"},
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
    private kineService: KinesiologyIntegrationService,
    private dialog: MatDialog,
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
          map(value => this._filter(value || '', this.kinesiologosOptions.map(kinesiologo => kinesiologo.firstName + ' ' + kinesiologo.lastName))),
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
                return this._filter(value || '', filteredKinesiologos.map(kinesiologo => kinesiologo.firstName + ' ' + kinesiologo.lastName));
              })
            );
          } else {
            this.filteredKinesiologosOptions = this.kinesiologoControl.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value || '', this.kinesiologosOptions.map(kinesiologo => kinesiologo.firstName + ' ' + kinesiologo.lastName))),
            );
          }
        });
      }
    } catch (error) {
      console.error('Error during initialization', error);
      let dialogConf = new MatDialogConfig();
      dialogConf.data = {
        message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
      };
      let d = this.dialog.open(ErrorDialogComponent, dialogConf);
      d.afterClosed().subscribe(() => {
        this.onClose();
      });
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
          console.log("instructor", this.appointmentData.instructor);
          if (this.appointmentData.participants!.length >= this.appointmentData.max_capacity) {
            this.isFull.set(true);
          } else {
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
      this.kineService.getKinesioUsers().subscribe({
        next: (kinesiologos: KineModel[]) => {
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
      this.kineService.getBodyParts().subscribe({
        next: (bodyParts: BodyPart[]) => {
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
        let dialogConf = new MatDialogConfig();
        dialogConf.data = {
          message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
        };
        let d = this.dialog.open(ErrorDialogComponent, dialogConf);
        console.error('Error al cambiar la asistencia del usuario', error);
      }
    );
  }

  isUserInAppointment() {
    console.log('userInfo: ', this.auth.userInfo());
    this.changeDetectorRef.markForCheck();
    if (this.isReserved()) {
      this.appointmentService.unreserveAppointment(this.data.id, this.auth.userInfo().email).subscribe({
        next: () => {
          console.log('Cita des-reservada');
          this.loadAppointment();
          this.appointmentService.notifyAppointmentChanged();
        },
        error: (error: any) => {
          let dialogConf = new MatDialogConfig();
          dialogConf.data = {
            message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
          };
          let d = this.dialog.open(ErrorDialogComponent, dialogConf);
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
          let dialogConf = new MatDialogConfig();
          dialogConf.data = {
            message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
          };
          let d = this.dialog.open(ErrorDialogComponent, dialogConf);
          console.error('Error al reservar la cita', error);
        }
      });
    }
  }

  addUserToKineAppointment() {
    if (this.kinesiologoControl.valid) {
      this.appointmentService.addUserToKinesiologyAppointment(
        this.data.id,
        this.auth.userInfo().email,
        this.kinesiologosOptions.find(kinesiologo =>
          kinesiologo.firstName + ' ' + kinesiologo.lastName === this.kinesiologoControl.value
        )!
      ).then((observable) => {
        observable.subscribe(() => {
          this.loadAppointment();
        });
      });
    } else {
      this.kinesiologoControl.markAsDirty();
      this.kinesiologoControl.markAsTouched();
    }
  }

  removeUserFromKineAppointment() {
    this.appointmentService.unreserveKinesiologyAppointment(this.data.id, this.auth.userInfo().email).subscribe({
      next: () => {
        console.log('Usuario removido de la cita de kinesiología');
        this.loadAppointment();
      },
      error: (error: any) => {
        let dialogConf = new MatDialogConfig();
        dialogConf.data = {
          message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
        };
        let d = this.dialog.open(ErrorDialogComponent, dialogConf);
        console.error('Error al remover el usuario de la cita de kinesiología', error);
      }
    });
  }

  isPast(): boolean {
    if (new Date(this.appointmentData!.date) < new Date()){
      console.log('isPast: ', true);
      return true;
    } else if (new Date(this.appointmentData!.date) > new Date()) {
      return false;
    } else {
      if (this.appointmentData?.startTime && this.appointmentData?.endTime) {
        const now = new Date();
        const startTime = new Date(this.appointmentData.startTime);
        const endTime = new Date(this.appointmentData.endTime);
        return now < startTime;
      } else {
        return false;
      }
    }
  }

}
