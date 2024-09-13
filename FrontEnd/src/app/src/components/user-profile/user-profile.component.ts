import { ChangeDetectionStrategy, Component} from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent {
  constructor(public auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      console.log('el usuario es:', user);});
  }

}


