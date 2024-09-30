import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {Activity, LocalTime} from "../../components";
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    DrawerComponent, MatDatepickerModule, MatFormFieldModule, NgbTimepickerModule, FormsModule, MatOptionModule, MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentComponent {
  time = signal<LocalTime>({
    hour: 13,
    minute: 30,
  });
  activities: Activity[] = [];

  readonly range = signal({
    start: new Date(Date.now()),
    end: new Date(Date.now()),
  });

  constructor() {

  }
  activityID = signal<number>(0); //TODO: add default value from service response

  createAppointment() {
    alert('Appointment created with  range: ' + this.range().start + ' - ' + this.range().end + ' and activityID: ' + this.activityID);
  }
}
