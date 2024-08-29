import { ChangeDetectionStrategy, Component, Inject, model, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../components/index';
import { DOCUMENT } from '@angular/common';
import { DrawerComponent } from "../../components/drawer/drawer.component";

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
  imports: [MatChipsModule, MatListModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, DrawerComponent],
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

  public apointments = {
    startTime: new Date(2023, 0, 1, 10, 0),
    endTime: new Date(2023, 0, 1, 11, 0),
    activity: 'Crossfit',
    max_capacity: '20',
    users: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
    professional: 'John Doe',
    weekDay: 'Monday',
  };


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
