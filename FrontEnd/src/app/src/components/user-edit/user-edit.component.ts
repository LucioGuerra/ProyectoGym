import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { User, Role } from '../models/user.models';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { DrawerComponent } from '../drawer/drawer.component';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ToolbarComponent, MatIconModule, FormsModule, MatIconButton, MatButtonModule, MatFormField, MatCard, DrawerComponent, CommonModule, MatLabel, MatOption, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {
  user: User;
  roles: { id: number; name: string }[] = [
    { id: 1, name: 'User' },
    { id: 2, name: 'Admin' }
  ];

  userImage: string | any;

  constructor(public auth: AuthService, private router: Router){
    this.user = {
      id: 123,
      firstName: 'Martin',
      lastName: 'Eliseche',
      email: 'tinchoeliseche@gmail.com',
      role: { id: 2, name: 'Admin' },
      phone: 2262369000,
      password: '1234',
      creditExpiration: new Date(),
    };
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((profile: any) => {
      this.userImage = profile.picture;
    });
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }

  PasswordChange(): void {
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
    alert('Changes were saved.');
  }
}
