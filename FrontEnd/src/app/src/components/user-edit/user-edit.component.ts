import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {Role, UserModel} from '../models';
import {MatIconModule} from '@angular/material/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {DrawerComponent} from '../drawer/drawer.component';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {AuthService} from "../services/services";
import {User} from "@auth0/auth0-angular";
import {NgIf, TitleCasePipe} from "@angular/common";
import {UserService} from "../services/services/user.service";

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [MatIconModule,
    FormsModule,
    MatButtonModule,
    MatCard,
    DrawerComponent,
    ReactiveFormsModule,
    MatDividerModule,
    MatCardHeader,
    MatCardContent,
    MatError,
    MatInput,
    MatFormField,
    MatLabel,
    TitleCasePipe,
    NgIf],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent {
  user = signal<User>({});
  found = signal<boolean>(false);

  id: string | null = '';

  isHovering = false;
  form: FormGroup;
  matcher = new ErrorStateMatcher();
  userModel = signal<UserModel>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: Role.CLIENT,
    phone: '',
    dni: '',
    picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
  });
  protected readonly Role = Role;

  constructor(public auth: AuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,) {
    console.log(this.user().picture);

    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      picture: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.user.set(this.auth.userInfo());
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id == null) {
      this.userService.getUserByEmail(String(this.user().email)).subscribe({
        next: (userModel) => {
          this.userModel.set(userModel);
          this.found.set(true);
          this.form.patchValue(this.userModel());
        },
        error: (error) => {
          console.error('User not found');
        }
      });
    } else {
      if (this.userModel().role === Role.ADMIN) {
        this.userService.getUserById(this.id).subscribe({
          next: (userVista) => {
            this.form.patchValue(userVista);
            this.found.set(true);
          }, error: (error) => {
            console.error('User not found');
          }
        });
      } else if (this.userModel().role === Role.CLIENT) {
        this.router.navigate(['/edit']);
      }
    }

  }

  back() {
    window.history.back();
  }

  changePassword(): void {
    alert('Changing password');
    this.router.navigate(['/change-password']);
  }

  changeRole(selectedRole: Role) {
    this.form.patchValue({role: selectedRole});
  }

  saveChanges() {
    if (this.form.invalid) {
      this.form.markAsTouched();
      return;
    } else if (this.form.valid) {
      this.userModel.set({
        ...this.userModel(),
        ...this.form.value
      });
      console.log('User model:', this.userModel());
      this.userService.updateUser(this.userModel()).subscribe({
        next: (updatedUser: UserModel) => {
          console.log(updatedUser)
          alert('User updated successfully');
        },
        error: (error: any) => {
          console.error('Error updating user:', error);
        },
        complete: () => {
          console.log('Update user completed');
        }
      });
    }
  }

  changePicture() {
    alert("Insert the new picture");
  }

  showText(isHovering: boolean) {
    this.isHovering = isHovering;
  }
}
