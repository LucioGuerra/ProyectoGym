import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import passwordValidators from "./password-validator.validators"
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {Router} from '@angular/router';
import {AuthService} from "../services/services/auth.service";
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
  imports: [MatTooltipModule, FormsModule, ToolbarComponent, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, MatIconModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  hide1 = true;
  hide2 = true;

  auth0 = inject(AuthService);

  emailFormControl = new FormControl("", [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  formGroup = new FormGroup({
    email: this.emailFormControl,
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    dni: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), passwordValidators.passwordStrengthValidator]),
    repassword: new FormControl("", [Validators.required, passwordValidators.passwordMatchValidator]),
  });

  constructor(private router: Router) {
  }

  validacionPassword(): boolean {
    console.log("Entró al validar contraseña")
    return this.formGroup.get(['password'])?.value === this.formGroup.get(['repassword'])?.value;
  }

  signup(): void {
    if (this.formGroup.valid) {
      if (this.validacionPassword()) {
        const json = this.formGroup.value;
        var user: UserModel = {
          dni: json.dni!,
          firstName: json.firstName!,
          lastName: json.lastName!,
          email: json.email!
        };
        console.log(json);
        this.auth0.signup(json.email?.toString(), json.password?.toString(), user);
      } else {
        this.formGroup.markAsTouched();
      }
    } else {
      this.formGroup.markAsTouched();
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
