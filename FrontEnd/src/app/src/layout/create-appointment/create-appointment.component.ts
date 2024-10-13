import {ChangeDetectionStrategy, Component, effect, OnInit} from '@angular/core';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import {
  CreateAppointmentFormComponent
} from "../../components/create-appointment-form/create-appointment-form.component";
import {MatDividerModule} from "@angular/material/divider";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../components/services/services/auth.service";

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

  constructor(private auth0: AuthService, private router: Router, private route: ActivatedRoute) {
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
    this.appointmentID = this.route.snapshot.paramMap.get('id');
  }



}
