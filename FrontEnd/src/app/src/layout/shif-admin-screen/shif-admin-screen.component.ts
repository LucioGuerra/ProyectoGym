import {
  ChangeDetectionStrategy,
  Component, effect, OnInit,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../components/services/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import {ActivityService, Appointment, AppointmentService, ToolbarComponent} from '../../components';
import { DrawerComponent } from "../../components/drawer/drawer.component";

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {provideNativeDateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Activity } from '../../components/index';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [MatMenuModule, MatProgressBarModule, MatChipsModule, MatListModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, DrawerComponent],
  templateUrl: './shif-admin-screen.component.html',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },],
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent implements OnInit {

  private subscription = new Subscription();

  public activities: Activity[] = [];

  public appointments: Appointment[] = [];

  selectedDate = signal<Date>(new Date(new Date().setDate(new Date().getDate() - 1)));
  selectedActivities = signal<string[]>([]);



  constructor(private auth0: AuthService, private router: Router, private appointmentService: AppointmentService, private activityService: ActivityService) {
    /*effect(() => {
      if(this.auth0.isAuthenticated()){
        if(this.auth0.isAdmin()){
        }
        //todo redirect to client page
      }
      else{
        this.router.navigate(['/login']);
      }
    });*/
  }

  ngOnInit(): void {
    this.loadAppointment();
    this.loadActivities();
  }

  loadAppointment() {
    this.appointmentService.getAppointmentsByDate(this.selectedDate()).subscribe(
      (data: Appointment[]) => {
        console.log('Datos en el componente:', data); // Aquí los datos ya fueron recibidos
        this.appointments = data;

        // Este console.log se ejecutará después de que los datos hayan sido asignados
        console.log('Datos en el componente después de la asignación:', this.appointments);
      },
      (error) => {
        console.error('Error al obtener las citas', error);
      }
    );
  }

  loadActivities() {
    this.activityService.getActivities().subscribe(
      (data: Activity[]) => {
        console.log('Datos en el componente:', data); // Aquí los datos ya fueron recibidos
        this.activities = data;
        this.selectedActivities.set(this.activities.map(activity => activity.name));
        // Este console.log se ejecutará después de que los datos hayan sido asignados
        console.log('Datos en el componente después de la asignación:', this.activities);
      },
      (error) => {
        console.error('Error al obtener las actividades', error);
      }
    );
  }

  datePickerChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate.set(event.value!);
    this.loadAppointment();
    // alert(`date: ${this.selectedDate().toLocaleDateString()}, apointements: ${this.apointments[0].date} son iguales? ${this.selectedDate().toDateString() == this.apointments[0].date.toDateString()}`);
  }
  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    // this.selectedActivities.update(selectedActivities => [...selectedActivities, $event.value]);
    this.selectedActivities.set($event.value);
    // alert(`quantity selectioned: ${this.selectedActivities().length}, activities: ${this.selectedActivities()}`);
  }
  noActivities(): Boolean {
    let len = this.appointments.filter(appointment =>
      appointment.date.toDateString() == this.selectedDate().toDateString() && this.selectedActivities().includes(appointment.activity)
    ).length == 0;
    console.log('No activities:', this.selectedActivities(), 'activity:', this.appointments[0].activity, 'date:', this.appointments[0].date, 'is equal?', this.selectedActivities().includes(this.appointments[0].activity));
    return len;
  }
  open_apointment($event: Event, appointment: Appointment) {
    $event.stopPropagation();
    $event.preventDefault();
    alert(`opening appointment id: ${appointment.id}`);
  }
  edit_apointment($event: Event, appointmentID: number) {
    $event.stopPropagation();
    $event.preventDefault();
    this.router.navigate([`/admin/appointment/${appointmentID}`]);
  }
  cancel_apointment($event: MouseEvent, appointment: Appointment) {
    $event.stopPropagation();
    $event.preventDefault();
    alert(`canceling appointment id: ${appointment.id}`);
  }
  newShift($event: MouseEvent) {
    alert('new shift');
  }
  newActivity($event: MouseEvent) {
    alert('new activity');
  }
  newUser($event: MouseEvent) {
    alert('new user');
  }
  newSale($event: MouseEvent) {
    alert('new sale');
  }
  shop($event: MouseEvent) {
    alert('shop');
  }
}
