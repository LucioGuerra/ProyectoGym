import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router } from '@angular/router';
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
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingupComponent {
  error = false;
  hide = true;

  firstName = '';
  lastName = '';
  email = '';
  dni = '';
  password = '';

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  
  formGroup = new FormGroup({
    firstName: new FormControl(Validators.required),
    lastName: new FormControl(Validators.required),
    email: this.emailFormControl,
    dni: new FormControl(Validators.required),
    password: new FormControl(Validators.required),
    repassword: new FormControl(Validators.required),
  });

  validacionPassword(): boolean {
    return this.formGroup.get(['password'])?.value === this.formGroup.get(['repassword'])?.value;
  }

  singup(): void {
    if (this.formGroup.valid) {
      if (this.validacionPassword()) {
        this.error = false
        const json = this.formGroup.value;
        console.log(json);
      } else {
        console.log('Las contraseñas no coinciden');
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