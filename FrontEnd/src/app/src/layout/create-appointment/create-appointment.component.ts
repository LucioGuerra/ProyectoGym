import {ChangeDetectionStrategy, Component, effect, OnInit} from '@angular/core';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import {
  CreateAppointmentFormComponent
} from "../../components/create-appointment-form/create-appointment-form.component";
import {MatDividerModule} from "@angular/material/divider";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../components/services/services/auth.service";
import { MainScreenComponent } from "../main-screen/main-screen.component";

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    DrawerComponent,
    CreateAppointmentFormComponent,
    MatDividerModule,
    MainScreenComponent
],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentComponent implements OnInit {
  appointmentID: string | null = null;

  constructor(private auth0: AuthService, private router: Router, private route: ActivatedRoute) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
        } else if (this.auth0.isClient()) {
          this.router.navigate(['/agenda']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    console.log('is admin? ', this.auth0.isAdmin(), 'is client? ', this.auth0.isClient());
  }

  ngOnInit(): void {
    this.appointmentID = this.route.snapshot.paramMap.get('id');
  }



}
