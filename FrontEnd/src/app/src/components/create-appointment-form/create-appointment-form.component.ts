import {ChangeDetectionStrategy, Component, Input, signal, OnInit, SimpleChanges} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule, NgForm,
  ReactiveFormsModule, ValidatorFn,
  Validators
} from '@angular/forms';
import {ErrorStateMatcher, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CalendarModule} from 'primeng/calendar';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {Activity, Appointment, AppointmentRequest, DayOfWeek, Instructor, LocalTime} from "../models";
import {MatButtonModule} from "@angular/material/button";
import {MatChipListbox, MatChipListboxChange, MatChipOption} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-appointment-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CalendarModule, MatInputModule, MatIconModule, MatCardModule, MatSelectModule, MatChipListbox, MatChipOption, MatCheckboxModule],
  templateUrl: './create-appointment-form.component.html',
  styleUrl: './create-appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentFormComponent implements OnInit {
  @Input() appointmentId: string | null = null;

  readonly range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
    maxCapacity: new FormControl<number | null>(20, [Validators.required, Validators.min(1), Validators.max(100)]),
    activity: new FormControl<number | null>(null, [Validators.required, this.activityValidator]),
    instructor: new FormControl<number | null>(null, [Validators.required]),
    daysOfWeek: new FormControl<DayOfWeek[] | []>([]),
    startTime: new FormControl<string | null>(this.formatTime(new Date()), [Validators.required]),
    endTime: new FormControl<string | null>(this.formatTime(new Date(new Date().setHours(new Date().getHours() + 1))), [Validators.required]),
    multiple: new FormControl<boolean | null>(false),
  }, {validators: Validators.compose([this.dateRangeValidator.bind(this), this.timeRangeValidator.bind(this)])});


  private activityValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value === null || value === -1) {
      return { activityInvalid: true };
    }
    return null;
  }

  startTime: string = this.formatTime(new Date());
  endTime: string = this.formatTime(new Date(new Date().setHours(new Date().getHours() + 1)));

  activities: Activity[] = [
    {id: 1, name: 'Yoga'},
    {id: 2, name: 'Pilates'},
    {id: 3, name: 'Crossfit'},
    {id: 4, name: 'Spinning'},
    {id: 5, name: 'Zumba'},
    {id: 6, name: 'Natación'},
    {id: 7, name: 'Running'},
    {id: 8, name: 'Ciclismo'},
    {id: 9, name: 'Kinesiology'},
  ];

  selectedActivityId = -1;

  maxCapacity = 20;

  dateRange = false;
  multiple = false;

  instructors: Instructor[] = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Jane', lastName: 'Smith'},
    {id: 3, firstName: 'Alice', lastName: 'Johnson'},
    {id: 4, firstName: 'Bob', lastName: 'Brown'},
  ];

  selectedInstructorId = -1;

  daysOfWeek = Object.values(DayOfWeek);

  selectedWeekDays = signal<DayOfWeek[]>([]);
  public timeRangeInvalid: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if (this.appointmentId) {
      this.loadAppointmentData(this.appointmentId);
    } else {
      this.loadAppointmentData();
    }
  }

  private loadAppointmentData(id?: string): void {
    // Simulación de datos para actualizar el formulario
    const appointmentData: Appointment = {
      date: new Date(new Date().setDate(new Date().getDate() - 10)),
      startTime: '15:00',
      endTime: '16:00',
      activity: "Yoga",
      max_capacity: 20,
      participantsCount: 10,
      participants: [],
      instructor: 'John Doe',
      id: 5,
    };

    if (id) {
      // Rellenar el formulario con los datos obtenidos
      this.range.patchValue({
        start: appointmentData.date,
        end: appointmentData.date,
        maxCapacity: appointmentData.max_capacity,
        activity: this.activities.find(activity => activity.name === appointmentData.activity)?.id,
        instructor: this.instructors.find(instructor => instructor.firstName === appointmentData.instructor?.split(" ")[0])?.id,
        daysOfWeek: [],
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
      });

      this.selectedActivityId = this.activities.find(activity => activity.name === appointmentData.activity)?.id!;

      this.maxCapacity = appointmentData.max_capacity;

      this.selectedInstructorId = this.instructors.find(instructor => instructor.firstName === appointmentData.instructor!.split(" ")[0])?.id!;
      console.log("instructor id" + this.selectedInstructorId + " activity id" + this.selectedActivityId);
      this.startTime = appointmentData.startTime;

      this.endTime = appointmentData.endTime;

      // Para actualización, puedes ajustar las validaciones si son diferentes
      this.applyUpdateValidators();
    } else {
      this.range.patchValue({
        start: new Date(Date.now()),
        end: new Date(Date.now()),
        maxCapacity: 20,
        activity: -1,
        instructor: -1,
        startTime: this.startTime,
        endTime: this.startTime,
      });

      // Para creación, puedes ajustar las validaciones si son diferentes
      this.applyCreateValidators();
    }
    this.range.setValidators(this.timeRangeValidator as ValidatorFn);
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

  private applyUpdateValidators(): void {
    // Ejemplo: solo algunos campos son requeridos para actualización
    this.range.get('start')?.setValidators([Validators.required]);
    this.range.get('end')?.setValidators([Validators.required, Validators.nullValidator]);
    // Agregar otras validaciones necesarias para actualización
    this.range.updateValueAndValidity();
  }

  // Validador personalizado para rango de fechas
  private dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;

    if (start && end && start > end && start >= Date.now()) {
      return {dateRangeInvalid: true};
    }
    return null;
  }

  createAppointment() {
    if (this.range.valid) {
      const [startHour, startMinute] = this.range.value.startTime.split(':').map(Number);
      const [endHour, endMinute] = this.range.value.endTime.split(':').map(Number);

      const stTime: LocalTime = {hour: startHour, minute: startMinute};
      const eTime: LocalTime = {hour: endHour, minute: endMinute};
      const appointmentData: AppointmentRequest = {
        date: this.range.value.start!,
        endDate: this.range.value.end!,
        startTime: stTime,
        endTime: eTime,
        activityID: this.range.value.activity,
        instructorID: this.activities.find(activity => activity.id === this.range.value.activity)?.name === 'Kinesiology' ? null : this.range.value.activity (this.range.value.instructor ? this.range.value.instructor : null),
        max_capacity: this.range.value.maxCapacity,
        appointmentWeekDays: Array.from(this.selectedWeekDays().values()),
      };

      alert('Turno creado: ' + JSON.stringify(appointmentData));
    }
  }

  isKinesiologySelected(): boolean {
    return (
      this.range.get("activity") !== null &&
      this.activities.find(activity => activity.id === this.range.get("activity")?.value)?.name === 'Kinesiology'
    );
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    this.selectedWeekDays.set($event.value);
  }

  dateChangeEvent(change: string, $event: MatDatepickerInputEvent<any, any>) {
    this.range.patchValue({start: $event.value, end: $event.value});
  }

  updateAppointment() {
    if (this.range.valid) {
      const [startHour, startMinute] = this.range.value.startTime.split(':').map(Number);
      const [endHour, endMinute] = this.range.value.endTime.split(':').map(Number);

      const stTime: LocalTime = {hour: startHour, minute: startMinute};
      const eTime: LocalTime = {hour: endHour, minute: endMinute};
      const appointmentData: AppointmentRequest = {
        date: this.range.value.start!,
        endDate: this.range.value.end!,
        startTime: stTime,
        endTime: eTime,
        activityID: this.range.value.activity,
      }
    }
  }

  Cancel() {
    this.router.navigate(['/admin/agenda']);
  }

  private applyCreateValidators() {
    // Ejemplo: todos los campos son requeridos para creación
    this.range.get('start')?.setValidators([Validators.required]);
    this.range.get('end')?.setValidators([Validators.required]);
    // Agregar otras validaciones necesarias para creación
    this.range.updateValueAndValidity();
  }

  protected readonly Date = Date;
  today: Date = new Date();

  validateTimeRange() {
    if (this.range.get("endTime") && this.range.get("startTime")) {
      this.timeRangeInvalid = this.range.get("startTime")?.value >= this.range.get("endTime")?.value;
      console.log(this.timeRangeInvalid);
    }
  }
}
