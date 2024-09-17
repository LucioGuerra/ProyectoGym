import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { User, Role } from '../models/user.models';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DrawerComponent } from '../drawer/drawer.component';


@Component({
  selector: 'app-user-edit',
  standalone: true,

  imports: [ToolbarComponent, MatIconModule, FormsModule, MatIconButton, MatButtonModule, MatFormField, MatCard, DrawerComponent, CommonModule, MatLabel, MatOption, ReactiveFormsModule, MatSelect, MatDividerModule, MatCardHeader,MatCardContent, MatButtonToggleModule, MatSelectModule],
  
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent implements OnInit {
  user: User;  
  userImage: string | undefined;  
  roles: { id: number; name: string }[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
  ];

  constructor(public auth: AuthService, private router: Router) {
    
    this.user = {
      id: 123,
      firstName: 'Martin',
      lastName: 'Eliseche',
      email: 'tinchoeliseche@gmail.com',
      role: { id: 1, name: 'Admin' },
      phone: 2262369000,
      password: '1234',
      creditExpiration: new Date(),
      dni: 12093847,
    };
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((profile: any) => {
      this.userImage = profile?.picture;
    });
  }

  
  homePage() {
    this.router.navigate(['/home']);
  }

 
  PasswordChange(): void {
    alert('Changing password!');
    this.router.navigate(['/change-password']);
  }

  
  email() {
    alert('Warning: The email cannot be modified.');
  }

  adminRole() {
    this.user.role = { id: 1, name: 'Admin' };
  }

  userRole() {
    this.user.role = { id: 2, name: 'User' };
  } 


  saveChanges() {

    if (!this.user.firstName || this.user.firstName.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    if (!this.user.lastName || this.user.lastName.trim() === '') {
      alert('Surname cannot be empty');
      return;
    }

    if (!this.user.dni) {
      alert('DNI cannot be empty');
      return;
    }

    if (isNaN(this.user.dni) || this.user.dni.toString().length !== 8 || this.user.dni < 0) {
      alert('DNI must be an 8 digit number');
      return;
    }

    if (!this.user.phone) {
      alert('Mobile cannot be empty');
      return;
    }

    if (this.user.phone < 0) {
      alert('Mobile cannot be a negative number')
      return;
    }

    if (isNaN(this.user.phone)) {
      alert('Mobile must be a number');
      return;
    }
 
    alert('Changes were successfully saved.');
    console.log("diccionario del usuario: ");
    console.dir(this.user);
  }
}

