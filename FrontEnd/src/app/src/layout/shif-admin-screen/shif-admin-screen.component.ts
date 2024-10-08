import {
  ChangeDetectionStrategy,
  Component, effect,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../components/services/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import {Appointment, ToolbarComponent} from '../../components';
import { DrawerComponent } from "../../components/drawer/drawer.component";

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
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
  providers: [provideNativeDateAdapter()],
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent{

  private subscription = new Subscription();

  public activities = [{
    name: 'Crossfit',
  },
  {
    name: 'Yoga',
  },
  {
    name: 'Pilates',
  },
  {
    name: 'Spinning',
  },
  {
    name: 'Zumba',
  },
  {
    name: 'Boxing',
  },
  {
    name: 'MMA',
  },
  {
    name: 'Kickboxing',
  },
  {
    name: 'Judo',
  },
  {
    name: 'Karate',
  },
  ];

  public appointments: Appointment[] = [{
    id: 1,
    date: new Date(Date.now()),
    startTime: '10:00',
    endTime: '11:00',
    activity: 'Crossfit',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
  },
  {
    id: 2,
    date: new Date(2023, 2, 10),
    startTime: '11:00',
    endTime: '12:00',
    activity: 'Yoga',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '12:00',
    endTime: '13:00',
    activity: 'Pilates',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 0
  },
  {
    id: 3,
    date: new Date(Date.now()),
    startTime: '13:00',
    endTime: '14:00',
    activity: 'Spinning',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
  },
  {
    date: new Date(Date.now()),
    startTime: '14:00',
    endTime: '15:00',
    activity: 'Zumba',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 4,
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '15:00',
    endTime: '16:00',
    activity: 'Boxing',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 5,
  },
  {
    date: new Date(Date.now()),
    startTime: '16:00',
    endTime: '17:00',
    activity: 'MMA',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 6,
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '17:00',
    endTime: '18:00',
    activity: 'Kickboxing',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 7,
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '18:00',
    endTime: '19:00',
    activity: 'Judo',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 8,
  },
  {
    date: new Date(Date.now()),
    startTime: '19:00',
    endTime: '20:00',
    activity: 'Karate',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 9,
  },
  {
    date: new Date(Date.now()),
    startTime: '20:00',
    endTime: '21:00',
    activity: 'Crossfit',
    max_capacity: 20,
    participantsCount: 10,
    instructor: 'John Doe',
    id: 10,
  },
  ];

  selectedDate = signal<Date>(new Date(Date.now()));
  selectedActivities = signal<string[]>(["Crossfit", "Yoga", "Pilates", "Spinning", "Zumba", "Boxing", "MMA", "Kickboxing", "Judo", "Karate"]);



  constructor(private auth0: AuthService, private router: Router) {
    effect(() => {
      if(this.auth0.isAuthenticated()){
        if(this.auth0.isAdmin()){
        }
        //todo redirect to client page
      }
      else{
        this.router.navigate(['/login']);
      }
    });
  }

  datePickerChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate.set(event.value!);
    // alert(`date: ${this.selectedDate().toLocaleDateString()}, apointements: ${this.apointments[0].date} son iguales? ${this.selectedDate().toDateString() == this.apointments[0].date.toDateString()}`);
  }
  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    // this.selectedActivities.update(selectedActivities => [...selectedActivities, $event.value]);
    this.selectedActivities.set($event.value);
    // alert(`quantity selectioned: ${this.selectedActivities().length}, activities: ${this.selectedActivities()}`);
  }
  noActivities(): Boolean {
    return this.appointments.filter(appointment =>
      this.selectedActivities().includes(appointment.activity) && appointment.date.toDateString() == this.selectedDate().toDateString()
    ).length == 0;
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
