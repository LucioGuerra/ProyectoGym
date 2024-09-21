import {
  ChangeDetectionStrategy,
  Component, OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../components/services/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../components/index';
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
export class ShifAdminScreenComponent implements OnInit, OnDestroy {

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

  public apointments: Activity[] = [{
    id: 1,
    date: new Date(Date.now()),
    startTime: '10:00',
    endTime: '11:00',
    activity: 'Crossfit',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe'],
    professional: 'John Doe',
    weekDay: 'Friday',
  },
  {
    id: 2,
    date: new Date(2023, 2, 10),
    startTime: '11:00',
    endTime: '12:00',
    activity: 'Yoga',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '12:00',
    endTime: '13:00',
    activity: 'Pilates',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Smith', 'Jane Smith', 'John Doe'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 0
  },
  {
    id: 3,
    date: new Date(Date.now()),
    startTime: '13:00',
    endTime: '14:00',
    activity: 'Spinning',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
  },
  {
    date: new Date(Date.now()),
    startTime: '14:00',
    endTime: '15:00',
    activity: 'Zumba',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 4,
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '15:00',
    endTime: '16:00',
    activity: 'Boxing',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 5,
  },
  {
    date: new Date(Date.now()),
    startTime: '16:00',
    endTime: '17:00',
    activity: 'MMA',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 6,
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '17:00',
    endTime: '18:00',
    activity: 'Kickboxing',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 7,
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '18:00',
    endTime: '19:00',
    activity: 'Judo',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 8,
  },
  {
    date: new Date(Date.now()),
    startTime: '19:00',
    endTime: '20:00',
    activity: 'Karate',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 9,
  },
  {
    date: new Date(Date.now()),
    startTime: '20:00',
    endTime: '21:00',
    activity: 'Crossfit',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Friday',
    id: 10,
  },
  ];

  selectedDate = signal<Date>(new Date(Date.now()));
  selectedActivities = signal<string[]>(["Crossfit", "Yoga", "Pilates", "Spinning", "Zumba", "Boxing", "MMA", "Kickboxing", "Judo", "Karate"]);



  constructor(private auth0: AuthService, private router: Router) {
  }
  ngOnInit() {
    const authSub = this.auth0.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      console.log('isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        const adminSub = this.auth0.isAdmin$.subscribe((isAdmin: boolean) => {
          if(isAdmin){
            //Se queda en la pagina
          }else{
            //todo: redirigir a la pagina de inicio
          }
        });
        this.subscription.add(adminSub);
      } else {
        this.router.navigate(['/login']);
      }
    });
    this.subscription.add(authSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    if (this.apointments.filter(apointment =>
      this.selectedActivities().includes(apointment.activity) && apointment.date.toDateString() == this.selectedDate().toDateString()
    ).length == 0) {
      return true;
    } else {
      return false;
    }
  }
  open_apointment($event: Event, apointment: Activity) {
    $event.stopPropagation();
    $event.preventDefault();
    alert(`opening apointment id: ${apointment.id}`);
  }
  edit_apointment($event: Event, apointment: Activity) {
    $event.stopPropagation();
    $event.preventDefault();
    alert(`editing apointment id: ${apointment.id}`);
  }
  cancel_apointment($event: MouseEvent, apointment: Activity) {
    $event.stopPropagation();
    $event.preventDefault();
    alert(`canceling apointment id: ${apointment.id}`);
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
