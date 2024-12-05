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
import {Router} from '@angular/router';
import {AuthService} from "../services/services";

import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ToolbarComponent} from "../toolbar";
import {MatIcon} from "@angular/material/icon";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, ToolbarComponent, MatIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  error = false; //El error lo uso para mostrar el errorDialog una vez que se haga la incidencia
  hide = true;

  auth0 = inject(AuthService);

  emailFormControl = new FormControl("", [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();


  formGroup = new FormGroup({
    email: this.emailFormControl,
    password: new FormControl("", Validators.required),
  });

  constructor(private router: Router) {
    if (localStorage.getItem('selectedDate')) {
      localStorage.removeItem('selectedDate');
    }
  }

  onLogin(): void {
    if (this.formGroup.valid) {
      this.error = false
      const json = this.formGroup.value;
      console.log(json);
      this.auth0.login(json.email?.toString(), json.password?.toString());
      /*this.router.navigate(['/agenda']);*/
    } else {
      this.error = true;
      this.formGroup.markAllAsTouched();
    }
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  volver() {
    this.router.navigate(['/home']);
  }

  forgot() {
    this.router.navigate(['/forgot-password']);
  }

  google() {
    this.auth0.loginWithThirdParty("google-oauth2")
  }

  facebook() {
    this.auth0.loginWithThirdParty("facebook")
  }

  microsoft() {
    this.auth0.loginWithThirdParty("windowslive")
  }

}
