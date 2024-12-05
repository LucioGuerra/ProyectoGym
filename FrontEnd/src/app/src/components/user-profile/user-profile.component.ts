import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from "../services/services";
import {User} from "@auth0/auth0-angular";
import {MatDivider} from "@angular/material/divider";
import {Router} from "@angular/router";
import {MatListItem} from "@angular/material/list";
import {UserService} from "../services/services/user.service";
import {Role, UserModel} from "../models";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgOptimizedImage, MatDivider, MatListItem],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent {
  defaultImage = 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg';
  user = signal<User>({});
  userModel = signal<UserModel>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: Role.CLIENT,
    phone: '',
    dni: '',
    picture: new URL(this.defaultImage),
  });

  constructor(public auth: AuthService,
              private router: Router,
              private userService: UserService) {
    console.log("user info: ", this.auth.userInfo());
    this.user.set(this.auth.userInfo());
    console.log(this.user().picture);
    this.userService.getUserByEmail(String(this.user().email)).subscribe({
      next: (userModel) => {
        this.userModel.set(userModel);
      },error: () => {
      console.error('User not found');
      }
    });
  }

  userInfo() {
    console.log('userInfo');
    this.router.navigate(['/user-info']);
  }
}
