import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

import { ToolbarComponent } from '../toolbar/toolbar.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ToolbarComponent, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  error = false; //El error lo uso para mostrar el errorDialog una vez que se haga la incidencia
  hide = true;

  emailFormControl = new FormControl([Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  
  formGroup = new FormGroup({
    email: this.emailFormControl,
    password: new FormControl(Validators.required),
  });

  onLogin(): void {
    if (this.formGroup.valid) {
      this.error = false
      const json = this.formGroup.value;
      console.log(json); //Esto se borra después, es para corroborar q se esta mandando todo ok
    } else {
      this.error = true;
      this.formGroup.markAllAsTouched();
    }
  }

  constructor(private router: Router) {}
  singup(){
    this.router.navigate(['/singup']);
  }
  volver(){
    this.router.navigate(['/home']);
  }
  forgot(){
    this.router.navigate(['/forgot']);
  }

  //Esto lo dejo asi como para que se sepa q se tiene q hacer algo con esto, pero dsp se encarga el q tenga la incidencia de auth0
  google(){
    this.router.navigate(['/google']);
  }
  facebook(){
    this.router.navigate(['/facebook']);
  }
  microsoft(){
    this.router.navigate(['/microsoft']);
  }
}