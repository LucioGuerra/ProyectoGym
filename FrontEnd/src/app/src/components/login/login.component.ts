import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
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
  imports: [FormsModule, ToolbarComponent, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  error = false;
  hide = true;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onLogin(): void {
    if (this.formGroup.valid) {
      this.error = false
      const json = this.formGroup.value;
      console.log(json); //esto se borra después, es para corroborar q
    } else {
      this.error = true;
      this.formGroup.markAllAsTouched();
    }
  }

  constructor(private router: Router) {}
  register(){
  }
  volver(){
    this.router.navigate(['/home']);
  }
}