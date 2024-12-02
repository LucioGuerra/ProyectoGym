import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ToolbarComponent} from "../toolbar";
import {MyErrorStateMatcher} from "../signup/signup.component";

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
    ToolbarComponent
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

  constructor(private router: Router) {
  }

  back() {
    window.history.back()
  }

}
