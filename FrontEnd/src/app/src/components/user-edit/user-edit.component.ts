import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { User } from '../models/user.models';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';


@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ToolbarComponent, MatIconModule, FormsModule, MatIconButton, MatButtonModule, MatFormField],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent implements OnInit {
  user: User = {
    id: 123,
    firstName: 'Martin',
    lastName: 'Eliseche',
    email: 'tinchoeliseche@gmail.com',
    role: { id: 1, name: 'Admin' },
    phone: 2262369000,
    password: '1234',
    creditExpiration: new Date(),
  };

  userImage: string = "../../../../assets/picture.jpg";

  constructor(public auth: AuthService, private router: Router){
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((profile: any) => {
      this.userImage = profile.picture;
    });
  }
  

  onPasswordChange(): void {
    console.log("Password's change button clicked");
  }

  logout() {
    this.router.navigate(['/login']);
  }

  homePage() {
    this.router.navigate(['/home']);
  }

  email() {
    alert('Warning: The value of this section cannot be modified.');
  }

  saveChanges() {
    alert('changes were saved.');
  }


}


