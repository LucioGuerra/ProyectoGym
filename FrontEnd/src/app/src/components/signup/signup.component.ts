import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router } from '@angular/router';
import { AuthService } from "../services/services/auth.service";
import {UserModel} from "../models";
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ToolbarComponent, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, MatIconModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  error = false;//El error lo uso para mostrar el errorDialog una vez que se haga la incidencia
  hide = true;

  auth0 = inject(AuthService);

  emailFormControl = new FormControl("", [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  formGroup = new FormGroup({
    email: this.emailFormControl,
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    dni: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    repassword: new FormControl("", Validators.required),
  });

  validacionPassword(): boolean {
    console.log("Entró al validar contraseña")
    return this.formGroup.get(['password'])?.value === this.formGroup.get(['repassword'])?.value;
  }

  signup(): void {
    if (this.formGroup.valid) {
      if (this.validacionPassword()) {
        this.error = false
        const json = this.formGroup.value;
        var user: UserModel = {dni: json.dni!, firstName: json.firstName!, lastName: json.lastName!, email: json.email!};
        console.log(json);
        this.auth0.signup(json.email?.toString(), json.password?.toString(), user);
      } else {
        this.error = true;
        this.formGroup.markAsTouched();
      }
    } else {
      this.formGroup.markAsTouched();
    }
  }

  constructor(private router: Router) {}
  volver(){
    this.router.navigate(['/login']);
  }
}
