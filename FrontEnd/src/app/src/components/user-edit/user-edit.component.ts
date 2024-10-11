import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {Role, User} from '../models';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {DrawerComponent} from '../drawer/drawer.component';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-user-edit',
  standalone: true,

  imports: [MatIconModule, FormsModule, MatButtonModule, MatCard, DrawerComponent, ReactiveFormsModule, MatDividerModule, MatCardHeader, MatCardContent, MatError, MatInput, MatFormField, MatLabel, TitleCasePipe],

  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent implements OnInit {
  user: User;
  roles = Object.values(Role);
  userImage: string | undefined;
  form: FormGroup;
  matcher = new ErrorStateMatcher();

  constructor(public auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.user = {
      id: 12345678,
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'nombreapellido@gmail.com',
      role: Role.ADMIN,
      phone: 2211234567,
      password: '',
      dni: 1234567,
    };

    this.form = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      dni: [this.user.dni, [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(8)],
      ],
      phone: [this.user.phone, Validators.required]
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((profile: any) => {
      this.userImage = profile?.picture;
    });
  }

  homePage() {
    this.router.navigate(['/home']);
  }

  changePassword(): void {
    alert('Changing password!');
    this.router.navigate(['/change-password']);
  }

  changeRole(selectedRole: Role) {
    if (this.user.role !== selectedRole) {
      this.user.role = selectedRole;
    }
  }

  saveChanges() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.valid) {
      this.user = {
        ...this.user,
        ...this.form.value
      };

      alert("changes were successfully saved.")
      console.log("diccionario del usuario: ");
      console.dir(this.user);
    }

  }
}
