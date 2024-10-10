import {ChangeDetectionStrategy, Component, effect, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {Activity, Appointment, AppointmentRequest, DayOfWeek, Instructor, LocalTime} from "../models";
import {MatButtonModule} from "@angular/material/button";
import {MatChipListbox, MatChipListboxChange, MatChipOption} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {Router} from "@angular/router";
import {ActivityService, AppointmentService, AuthService} from "../services/services";
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../dialog/error-dialog/error-dialog.component';
import {HttpStatusCode} from "@angular/common/http";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-create-appointment-form',
  standalone: true,
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},],
  imports: [MatButtonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatCardModule, MatSelectModule, MatChipListbox, MatChipOption, MatCheckboxModule],
  templateUrl: './create-appointment-form.component.html',
  styleUrl: './create-appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentFormComponent implements OnInit {

  instructors: Instructor[] = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Jane', lastName: 'Smith'},
    {id: 3, firstName: 'Alice', lastName: 'Johnson'},
    {id: 4, firstName: 'Bob', lastName: 'Brown'},
  ]; // Simulación de datos de instructores

  @Input() appointmentId: string | null = null;

  kinesiology: string = 'Kinesiologia';

  today: Date = new Date();

  activities: Activity[] = []

  dateRange = false;

  daysOfWeek = Object.values(DayOfWeek);

  public timeRangeInvalid: boolean = false;

  readonly range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
    max_capacity: new FormControl<number | null>(20, [Validators.required, Validators.min(1), Validators.max(100)]),
    activity: new FormControl<number | null>(null, [Validators.required, this.activityValidator]),
    instructor: new FormControl<number | null>(null, [Validators.required]),
    daysOfWeek: new FormControl<DayOfWeek[] | []>([]),
    startTime: new FormControl<string | null>(this.formatTime(new Date()), [Validators.required]),
    endTime: new FormControl<string | null>(this.formatTime(new Date(new Date().setHours(new Date().getHours() + 1))), [Validators.required]),
    multiple: new FormControl<boolean | null>(false),
    kinesiologyQuantity: new FormControl<number | null>(4, [Validators.required, Validators.min(1), Validators.max(100)])
  }, {validators: Validators.compose([this.timeRangeValidator.bind(this)])});

  constructor(private auth: AuthService, private dialog: MatDialog, private router: Router, private activityService: ActivityService, private appointmentService: AppointmentService) {
  }

  ngOnInit(): void {
    this.loadActivities();
    if (this.appointmentId) {
      this.loadAppointmentData(this.appointmentId);
    } else {
      this.loadAppointmentData();
    }
  }

  loadActivities() {
    this.activityService.getActivities().subscribe(
      (data: Activity[]) => {
        console.log('Datos en el componente:', data); // Aquí los datos ya fueron recibidos
        this.activities = data;
        // Este console.log se ejecutará después de que los datos hayan sido asignados
        console.log('Datos en el componente después de la asignación:', this.activities);
      },
      (error) => {
        console.error('Error al obtener las actividades', error);
      }
    );
  }

  private loadAppointmentData(id?: string): void {
    if (id) {
      this.appointmentService.getAppointmentById(id).subscribe(
        (data: Appointment) => {
          console.log('Datos en el componente:', data);
          console.log('max_capacity:', data.max_capacity);
          this.range.patchValue({
            start: new Date(data.date),
            end: new Date(data.date),
            max_capacity: data.max_capacity,
            activity: this.activities.find(activity => activity.name === data.activity)?.id,
            instructor: this.instructors.find(instructor => instructor.firstName === data.instructor?.split(" ")[0])?.id || -1,
            daysOfWeek: [],
            startTime: data.startTime,
            endTime: data.endTime,
          });
          this.range.get('start')?.disable();

        },
        (error) => {
          if (error.status === 404) {
            this.dialog.open(ErrorDialogComponent, {
              data: {
                message: 'No se encontró la cita. Es posible que haya sido eliminada.',
              },
              disableClose: true
            }).afterClosed().subscribe(() => {
              this.router.navigate(['/admin/agenda']);
            });
            this.range.disable();
          } else {
            console.error('Error inesperado:', error);
          }
        }
      );
    } else {
      this.range.patchValue({
        start: new Date(Date.now()),
        end: new Date(Date.now()),
        max_capacity: 20,
        activity: -1,
        instructor: -1,
        startTime: this.formatTime(new Date()),
        endTime: this.formatTime(new Date(new Date().setHours(new Date().getHours() + 1))),
      });

    }
    console.log(formatDate(new Date(Date.now()).toLocaleDateString(), 'yyyy-MM-dd', 'en-US'));
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  private activityValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value === null || value === -1) {
      return {activityInvalid: true};
    }
    return null;
  }

  private timeRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const group = control as FormGroup;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startTime && endTime && startTime > endTime) {
      group.get('startTime')?.setErrors({timeRangeInvalid: true});
      group.get('endTime')?.setErrors({timeRangeInvalid: true});
      return {timeRangeInvalid: true};
    } else {
      group.get('startTime')?.setErrors(null);
      group.get('endTime')?.setErrors(null);
    }
    return null;
  }

  validateTimeRange() {
    if (this.range.get("endTime") && this.range.get("startTime")) {
      this.timeRangeInvalid = this.range.get("startTime")?.value >= this.range.get("endTime")?.value;
      console.log(this.timeRangeInvalid);
    }
  }

  isKinesiologySelected(): boolean {
    return (
      this.range.get("activity") !== null &&
      this.activities.find(activity => activity.id === this.range.get("activity")?.value)?.name === this.kinesiology
    );
  }

  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    this.range.patchValue({daysOfWeek: Array.from($event.value)});
    console.log(this.range.value.daysOfWeek);
  }

  dateChangeEvent(change: string, $event: MatDatepickerInputEvent<any, any>) {
    this.range.patchValue({start: $event.value, end: $event.value});
    console.log(this.range.value.start.toISOString());
    console.log(this.range.value.end.toISOString());
    console.log(this.range.value.start.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    }));
    var date = new Date();
  }

  createAppointment() {
    var start = new Date(this.range.value.start);
    var end = new Date(this.range.value.end);
    if (!this.dateRange) {
      end = new Date(this.range.value.start);
    }
    console.log('Fecha de inicio:', start.toISOString(), 'Fecha de fin:', end.toISOString());
    if (this.range.valid) {
      if (this.activities.find(activity => activity.id === this.range.value.activity)?.name === this.kinesiology) {
        const appointmentData: AppointmentRequest = {
          date: formatDate(start.toISOString(), 'YYYY-MM-DD', 'en-US'),
          endDate: formatDate(end.toISOString(), 'YYYY-MM-DD', 'en-US'),
          startTime: this.range.value.startTime,
          endTime: this.range.value.endTime,
          appointmentWeekDays: this.range.value.daysOfWeek,
          appointmentQuantity: this.range.value.kinesiologyQuantity,
        };
        console.log('Turno creado: ' + JSON.stringify(appointmentData));
        this.appointmentService.createKinesiologyAppointments(appointmentData).subscribe(
          (data: any) => {
            console.log('Datos de la respuesta:', data);
          },
          (error: any) => {
            console.error('Error al crear la cita:', error);
          }
        );
      } else {
        if (this.range.value.instructor === -1) {
          const appointmentData: AppointmentRequest = {
            date: formatDate(start.toISOString(), 'yyyy-MM-dd', 'en-US'),
            endDate: formatDate(end.toISOString(), 'yyyy-MM-dd', 'en-US'),
            startTime: this.range.value.startTime,
            endTime: this.range.value.endTime,
            activityID: this.range.value.activity,
            max_capacity: this.range.value.max_capacity,
            appointmentWeekDays: this.range.value.daysOfWeek,
          };
          console.log('Turno creado: ' + JSON.stringify(appointmentData));
          this.appointmentService.createAppointment(appointmentData).subscribe(
            (data: any) => {
              console.log('Datos de la respuesta:', data);
            },
            (error: any) => {
              console.error('Error al crear la cita:', error);
            }
          );
        } else {
          const appointmentData: AppointmentRequest = {
            date: formatDate(start.toISOString(), 'yyyy-MM-dd', 'en-US'),
            endDate: formatDate(end.toISOString(), 'yyyy-MM-dd', 'en-US'),
            startTime: this.range.value.startTime,
            endTime: this.range.value.endTime,
            activityID: this.range.value.activity,
            instructorID: this.activities.find(activity => activity.id === this.range.value.activity)?.name === this.kinesiology ? null : (this.range.value.instructor != -1 ? this.range.value.instructor : null),
            max_capacity: this.range.value.max_capacity,
            appointmentWeekDays: this.range.value.daysOfWeek,
          };
          console.log('Turno creado: ' + JSON.stringify(appointmentData));
          this.appointmentService.createAppointment(appointmentData).subscribe(
            (data: any) => {
              console.log('Datos de la respuesta:', data);
            },
            (error: any) => {
              console.error('Error al crear la cita:', error);
            }
          );
        }
      }
      this.router.navigate(['/admin/agenda']);
    }
  }

  updateAppointment() {
    if (this.range.valid) {
      if (this.activities.find(activity => activity.id === this.range.value.activity)?.name === this.kinesiology) {

      } else {
        if (this.range.value.instructor === -1) {
          const appointmentData: AppointmentRequest = {
            startTime: this.range.value.startTime,
            endTime: this.range.value.endTime,
            max_capacity: this.range.value.max_capacity,
            activityID: this.range.value.activity,
            updateAllFutureAppointments: this.range.value.multiple,
          }
          console.log('Datos del formulario:', JSON.stringify(appointmentData), 'ID del turno:', this.appointmentId);
          this.appointmentService.updateAppointment(this.appointmentId!, appointmentData).subscribe(
            (data: any) => {
              console.log('Datos de la respuesta:', data);
            },
            (error: any) => {
              console.error('Error al actualizar la cita:', error);
            }
          );
        } else {
          const appointmentData: AppointmentRequest = {
            startTime: this.range.value.startTime,
            endTime: this.range.value.endTime,
            max_capacity: this.range.value.max_capacity,
            activityID: this.range.value.activity,
            instructorID: this.range.value.instructor,
            updateAllFutureAppointments: this.range.value.multiple,
          }
          console.log('Datos del formulario:', JSON.stringify(appointmentData), 'ID del turno:', this.appointmentId);
          this.appointmentService.updateAppointment(this.appointmentId!, appointmentData).subscribe(
            (data: any) => {
              console.log('Datos de la respuesta:', data);
            },
            (error: any) => {
              console.error('Error al actualizar la cita:', error);
            }
          );
        }
      }
    }
  }

  Cancel() {
    this.router.navigate(['/admin/agenda']);
  }
}
