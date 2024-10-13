import {ChangeDetectionStrategy, Component, effect, signal} from '@angular/core';
import {NgIf, AsyncPipe, NgOptimizedImage} from '@angular/common';
import {AuthService} from "../services/services";
import {User} from "@auth0/auth0-angular";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgOptimizedImage],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent {
  user = signal<User>({});
  constructor(public auth: AuthService) {
      console.log("user info: ", this.auth.userInfo());
      this.user.set(this.auth.userInfo());
      console.log(this.user().picture);
  }

}


