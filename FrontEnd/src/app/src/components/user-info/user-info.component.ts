import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {DrawerComponent} from "../drawer/drawer.component";
import {Appointment, Role, UserModel} from "../models";
import {User} from "@auth0/auth0-angular";
import {Package} from "../models/package.models";

import {UserService} from "../services/services/user.service";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
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
import {MatActionList, MatListItem} from "@angular/material/list";
import {AuthService} from "../services/services";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    DrawerComponent,
    MatCardModule,
    MatButtonModule,
    MatCell,
    MatCellDef,
    MatChip,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatActionList,
    MatListItem,
    MatRow,
    MatRowDef,
    MatTable,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    NgIf,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  displayedColumns: string[] = ['date', 'activity'];
  user = signal<User>({});
  userModel = signal<UserModel>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: Role.CLIENT,
    phone: '',
    dni: '',
    picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg')
  });
  userAppointments = signal<Appointment[]>([]);
  userPackages = signal<Package[]>([]);
  streak = signal<number>(0);
  protected readonly Symbol = Symbol;

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
        const userId = userModel.id ?? 0;
        this.userService.getStreak(String(userId)).subscribe({
          next: (streak) => {
            this.streak.set(streak);
          },
          error: (error) => {
            console.error('Error fetching user streak');
          }
        });
        console.log('User streak: ', this.streak());
        this.userService.getUserAppointments(String(userId)).subscribe({
          next: (appointments) => {
            this.userAppointments.set(appointments);
          }, error: (error) => {
            console.error('User not found');
          }
        });

        this.userService.getUserHistory(userId).subscribe({
          next: (packages) => {
            this.userPackages.set(packages);
          }, error: (error) => {
            console.error('User not found');
          }
        });
      }, error: (error) => {
        console.error('User not found');
      }
    });
  }

  editUser() {
    this.router.navigate(['/edit']);
  }
}
