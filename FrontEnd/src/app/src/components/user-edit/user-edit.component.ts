import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Role} from '../models';
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
import {AuthService} from "../services/services/auth.service";
import {User} from "@auth0/auth0-angular";
import { signal } from "@angular/core";
import { UserModel } from "../models";
import {NgIf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [MatIconModule, FormsModule, MatButtonModule, MatCard, DrawerComponent, ReactiveFormsModule, MatDividerModule, MatCardHeader, MatCardContent, MatError, MatInput, MatFormField, MatLabel, TitleCasePipe, NgIf],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent {
  roles = Object.values(Role);
  form: FormGroup;
  authenticated = false;
  matcher = new ErrorStateMatcher();
  user = signal<User>({});
  userModel: UserModel;
  isHovering = false;

  constructor(public auth: AuthService, private router: Router, private fb: FormBuilder) {
    console.log("user info: ", this.auth.userInfo());
    this.user.set(this.auth.userInfo());
    console.log(this.user().picture);

    this.userModel = {
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
      firstName: [this.userModel.firstName, Validators.required],
      lastName: [this.userModel.lastName, Validators.required],
      dni: [this.userModel.dni, [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(8)],
      ],
      phone: [this.userModel.phone, Validators.required]
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
    if (this.userModel.role !== selectedRole) {
      this.userModel.role = selectedRole;
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

  changePicture(){
    alert("Insert the new picture");
  }

  showText(isHovering: boolean) {
    this.isHovering = isHovering;
  }

  protected readonly Role = Role;
}
