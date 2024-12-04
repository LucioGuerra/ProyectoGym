import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import passwordValidators from "../signup/password-validator.validators";
import {AuthService} from "../services/services";
import {User} from "@auth0/auth0-angular";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {ToolbarComponent} from "../toolbar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    ToolbarComponent,
    MatIconButton,
    MatSuffix
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  user = signal<User>({});
  hide1 = true;
  hide2 = true;
  formGroup = new FormGroup({
    oldpassword: new FormControl("", [Validators.required, passwordValidators.passwordStrengthValidator]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), passwordValidators.passwordStrengthValidator]),
    repassword: new FormControl("", [Validators.required, passwordValidators.passwordMatchValidator]),
  });

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user.set(this.auth.userInfo());
  }

  resetPassword(): void {
    if (this.formGroup.valid) {
      if (this.validacionPassword()) {
        const json = this.formGroup.value;
        console.log(json);
        // @ts-ignore
        this.auth.resetPassword(this.user().email, json.password);
      } else {
        this.formGroup.markAsTouched();
      }
    } else {
      this.formGroup.markAsTouched();
    }
  }

  validacionPassword(): boolean {
    console.log("Entró al validar contraseña")
    return this.formGroup.get(['password'])?.value === this.formGroup.get(['repassword'])?.value;
  }

  login() {
    this.router.navigate(['/login']);
  }
}
