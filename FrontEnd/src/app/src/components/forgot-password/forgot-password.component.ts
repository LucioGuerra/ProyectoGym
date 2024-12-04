import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ToolbarComponent} from "../toolbar";
import {MyErrorStateMatcher} from "../signup/signup.component";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../services/services";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ToolbarComponent,
    MatButton,
    MatIcon
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  emailFormControl = new FormControl("", [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  formGroup = new FormGroup({
    email: this.emailFormControl,
  });

  constructor(private router: Router,
              private auth: AuthService) {
  }

  back() {
    window.history.back()
  }

  login() {
    this.router.navigate(["/login"]);
  }

  enviarMail() {
    if (this.formGroup.valid) {
      const json = this.formGroup.value;
      if (this.emailFormControl.value != null) {
        this.auth.forgotPassword(this.emailFormControl.value)
      } else {
        console.log("Me está llegando null el email")
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
