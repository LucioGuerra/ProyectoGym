import { ChangeDetectionStrategy, Component } from '@angular/core';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import {
  CreateAppointmentFormComponent
} from "../../components/create-appointment-form/create-appointment-form.component";
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    DrawerComponent,
    CreateAppointmentFormComponent,
    MatDividerModule,
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentComponent {

}
