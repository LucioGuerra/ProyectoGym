import { ChangeDetectionStrategy, Component } from '@angular/core';
import {DrawerComponent} from "../../components/drawer/drawer.component";

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    DrawerComponent
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentComponent {

}
