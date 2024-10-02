import {ChangeDetectionStrategy, Component, Input, signal, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CalendarModule } from 'primeng/calendar';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {Activity, AppointmentRequest, DayOfWeek, Instructor, LocalTime} from "../models";
import { MatButtonModule } from "@angular/material/button";
import {MatChipListbox, MatChipListboxChange, MatChipOption} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'app-create-appointment-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CalendarModule, MatInputModule, MatIconModule, MatCardModule, NgForOf, MatSelectModule, NgIf, MatChipListbox, MatChipOption, MatCheckboxModule],
  templateUrl: './create-appointment-form.component.html',
  styleUrl: './create-appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentFormComponent implements OnInit {
  @Input() appointmentId: string | null = null;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  startTime: string = this.formatTime(new Date());
  endTime: string = this.formatTime(new Date(new Date().setHours(new Date().getHours() + 1)));

  activities: Activity[] = [
    { id: 1, name: 'Yoga'},
    { id: 2, name: 'Pilates'},
    { id: 3, name: 'Crossfit'},
    { id: 4, name: 'Spinning'},
    { id: 5, name: 'Zumba'},
    { id: 6, name: 'Natación'},
    { id: 7, name: 'Running'},
    { id: 8, name: 'Ciclismo'},
    { id: 9, name: 'Kinesiology'},
  ];

  selectedActivityId = -1;

  maxCapacity = 20;

  dateRange = false;

  instructors: Instructor[] = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' },
    { id: 3, firstName: 'Alice', lastName: 'Johnson' },
    { id: 4, firstName: 'Bob', lastName: 'Brown' },
  ];

  selectedInstructorId = -1;

  daysOfWeek = Object.values(DayOfWeek);

  selectedWeekDays = signal<DayOfWeek[]>([]);

  ngOnInit(): void {
    // Si `appointmentId` está presente en la inicialización, cargar datos
    if (this.appointmentId) {
      this.loadAppointmentData(this.appointmentId);
    }
  }

  // Implementar `ngOnChanges` para escuchar cambios en `appointmentId`
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentId'] && changes['appointmentId'].currentValue) {
      this.loadAppointmentData(changes['appointmentId'].currentValue);
    }
  }

  private loadAppointmentData(id: string): void {

    const appointmentData = {
      start: new Date(),
      end: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    };

    this.range.patchValue({
      start: appointmentData.start,
      end: appointmentData.end,
    });
    this.startTime = this.formatTime(appointmentData.startTime);
    this.endTime = this.formatTime(appointmentData.endTime);
  }



  createAppointment() {
    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.endTime.split(':').map(Number);

    const stTime: LocalTime = { hour: startHour, minute: startMinute };
    const eTime: LocalTime = { hour: endHour, minute: endMinute };const appointmentData:AppointmentRequest = {
      date: this.range.value.start!,
      endDate: this.range.value.end!,
      startTime: stTime,
      endTime: eTime,
      activityID: this.selectedActivityId,
      instructorID: this.selectedInstructorId,
      max_capacity: this.maxCapacity,
      appointmentWeekDays: Array.from(this.selectedWeekDays().values()),
    };

    alert('Turno creado: ' + JSON.stringify(appointmentData));
  }


  isKinesiologySelected(): boolean {
   return (
      this.selectedActivityId !== null &&
      this.activities.find(activity => activity.id === this.selectedActivityId)?.name === 'Kinesiology'
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

  protected readonly DayOfWeek = DayOfWeek;

  dateChangeEvent(change: string, $event: MatDatepickerInputEvent<any, any>) {
    this.range.value.start = $event.value;
    this.range.value.end = $event.value;
  }

  updateAppointment() {

  }
}
