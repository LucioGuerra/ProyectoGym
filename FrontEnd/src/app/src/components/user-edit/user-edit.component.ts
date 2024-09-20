import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Role, User } from '../models/user.models';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DrawerComponent } from '../drawer/drawer.component';
import { FormGroup } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';




@Component({
  selector: 'app-user-edit',
  standalone: true,

  imports: [MatIconModule, FormsModule, MatButtonModule, MatCard, DrawerComponent, ReactiveFormsModule, MatDividerModule, MatCardHeader,MatCardContent, MatButtonToggleModule, MatError, MatInput, MatFormField, MatLabel],
  
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent implements OnInit {
  user: User;  
  roles = Object.values(Role);
  userImage: string | undefined;  
  form: FormGroup;
  matcher = new ErrorStateMatcher();


 

  constructor(public auth: AuthService, private router: Router, private fb: FormBuilder) {
    
    this.user = {
      id: 123,
      firstName: 'Martin',
      lastName: 'Eliseche',
      email: 'tinchoeliseche@gmail.com',
      role: Role.ADMIN,
      phone: 2262369000,
      password: '1234',
      dni: 12093847,
    };

    this.form = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],

      dni: [this.user.dni, [Validators.required, 
                            Validators.minLength(8), 
                            Validators.maxLength(8)],
                          ],

      email: [{value: this.user.email, disabled: true}],
      phone: [this.user.phone, Validators.required]
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((profile: any) => {
      this.userImage = profile?.picture;
    });
  }

  
  homePage() {
    this.router.navigate(['/home']);
  }

 
  PasswordChange(): void {
    alert('Changing password!');
    this.router.navigate(['/change-password']);
  }


  changeRole(selectedRole: Role) {
    if (this.user.role !== selectedRole) {
      this.user.role = selectedRole;
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
}
