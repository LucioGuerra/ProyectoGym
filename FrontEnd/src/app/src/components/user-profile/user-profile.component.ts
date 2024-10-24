import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from "../services/services";
import {User} from "@auth0/auth0-angular";
import {MatDivider} from "@angular/material/divider";
import {Router} from "@angular/router";
import {MatListItem} from "@angular/material/list";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgOptimizedImage, MatDivider, MatListItem],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent {
  user = signal<User>({});

  constructor(public auth: AuthService, private router: Router) {
    console.log("user info: ", this.auth.userInfo());
    this.user.set(this.auth.userInfo());
    console.log(this.user().picture);
  }

  userInfo() {
    console.log('userInfo');
    this.router.navigate(['/user-info']);
  }
}


