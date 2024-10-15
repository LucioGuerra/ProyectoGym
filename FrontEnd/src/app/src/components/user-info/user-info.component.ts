import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {DrawerComponent} from "../drawer/drawer.component";
import {Role, UserModel} from "../models";
import {User} from "@auth0/auth0-angular";

import {UserService} from "../services/services/user.service";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    DrawerComponent,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  user = signal<User>({});
  userModel = signal<UserModel>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: Role.CLIENT,
    phone: '',
    dni: '',
    picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
  });

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.user().picture);

    this.userService.getUserById('1').subscribe({
      next: (userModel) => {
        this.userModel.set(userModel);
      }, error: (error) => {
        console.error('User not found');
      }
    });
  }
}
