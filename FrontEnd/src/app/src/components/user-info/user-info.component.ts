import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {DrawerComponent} from "../drawer/drawer.component";
import {Appointment, Role, UserModel} from "../models";
import {User} from "@auth0/auth0-angular";

import {UserService} from "../services/services/user.service";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {Router} from "@angular/router";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatChip} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatActionList, MatListItem} from "@angular/material/list";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {AuthService} from "../services/services";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    DrawerComponent,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    MatCell,
    MatCellDef,
    MatChip,
    MatColumnDef,
    MatHeaderCell,
    MatIcon,
    MatProgressBar,
    MatHeaderCellDef,
    MatActionList,
    MatListItem,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatTable
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  displayedColumns: string[] = ['date', 'activity'];
  user = signal<User>({});
  userModel = signal<UserModel>({
    id: 2,
    firstName: '',
    lastName: '',
    email: '',
    role: Role.CLIENT,
    phone: '',
    dni: '',
    picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
  });
  userAppointments = signal<Appointment[]>([]);

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.user.set(this.auth.userInfo());
    console.log(this.user().picture);
    this.displayedColumns = ['date', 'activity'];

    this.userService.getUserByEmail(String(this.user().email)).subscribe({
      next: (userModel) => {
        this.userModel.set(userModel);
      }, error: (error) => {
        console.error('User not found');
      }
    });

    this.userService.getUserAppointments('1').subscribe({
      next: (appointments) => {
        this.userAppointments.set(appointments);
        console.log(appointments)
      }, error: (error) => {
        console.error('User not found');
      }
    });

    // this.userService.getUserPackages('2').subscribe({
    //   next: (packages) => {
    //     this.userPackages.set(packages);
    //   }, error: (error) => {
    //     console.error('User not found');
    //   }
    // });
  }

  editUser(id: number) {
    this.router.navigate(['/edit']);
  }
}
