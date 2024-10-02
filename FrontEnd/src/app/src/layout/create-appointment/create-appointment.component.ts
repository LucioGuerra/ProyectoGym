import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import {
  CreateAppointmentFormComponent
} from "../../components/create-appointment-form/create-appointment-form.component";
import {MatDividerModule} from "@angular/material/divider";
import { ActivatedRoute } from '@angular/router';

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
export class CreateAppointmentComponent implements OnInit {
  appointmentID: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.appointmentID = this.route.snapshot.paramMap.get('id');
  }
}
