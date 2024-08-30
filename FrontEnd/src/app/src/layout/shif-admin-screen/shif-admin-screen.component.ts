import { ChangeDetectionStrategy, Component, Inject, model, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../components/index';
import { DOCUMENT } from '@angular/common';
import { DrawerComponent } from "../../components/drawer/drawer.component";

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [MatProgressBarModule, MatChipsModule, MatListModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, DrawerComponent],
  templateUrl: './shif-admin-screen.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent implements OnInit {
  save() {
    throw new Error('Method not implemented.');
  }
  undo() {
    throw new Error('Method not implemented.');
  }
  events = signal<string[]>([]);

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

  public apointments = [{
    date: new Date(2023, 2, 10),
    startTime: '10:00',
    endTime: '11:00',
    activity: 'Crossfit',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe'],
    professional: 'John Doe',
    weekDay: 'Monday',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '11:00',
    endTime: '12:00',
    activity: 'Yoga',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith'],
    professional: 'John Doe',
    weekDay: 'Monday',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '12:00',
    endTime: '13:00',
    activity: 'Pilates',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Smith', 'Jane Smith', 'John Doe'],
    professional: 'John Doe',
    weekDay: 'Monday',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '13:00',
    endTime: '14:00',
    activity: 'Spinning',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Monday',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '14:00',
    endTime: '15:00',
    activity: 'Zumba',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Monday',
  },
  {
    date: new Date(2023, 2, 10),
    startTime: '15:00',
    endTime: '16:00',
    activity: 'Boxing',
    max_capacity: 20,
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
  },
  ];


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.update(events => [...events, `${type}: ${event.value}`]);
  }


  constructor(@Inject(DOCUMENT) public document: Document, private auth: AuthService) {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('isAuthenticated:', isAuthenticated);
      if (!isAuthenticated) {
        this.auth.loginWithRedirect();
      } else {
        this.auth.user$.subscribe(user => {
          console.log('User:', user);
        });
      }
    });
  }
  ngOnInit(): void {

  }


}
