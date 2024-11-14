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
  styleUrls: ['./user-edit.component.scss'],
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

  userVista = signal<UserModel>({
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
              private route: ActivatedRoute) {
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
    this.userService.getUserByEmail(String(this.user().email)).subscribe({
      next: (userModel) => {
        this.userModel.set(userModel);
        this.found.set(true);

        if (this.id && this.userModel().role === Role.CLIENT) {
          this.router.navigate(['/edit']);
          return;
        }

        if (this.id && this.userModel().role === Role.ADMIN) {
          this.userService.getUserById(this.id).subscribe({
            next: (userVista: UserModel) => {
              this.form.patchValue(userVista);
              this.userVista.set(userVista);
              this.found.set(true);
            },
            error: () => {
              console.error('User not found');
            }
          });
        } else {
          this.userVista.set(userModel);
          this.form.patchValue(this.userModel());
        }
      },
      error: () => {
        console.error('User not found');
      }
    });
  }

  back() {
    const previousUrl = document.referrer;
    const isAdmin = this.userModel().role === Role.ADMIN;

    if (previousUrl !== '/user-info' && !isAdmin) {
      this.router.navigate(['/user-info']);
    } else if (isAdmin) {
      window.history.back();
    }
  }

  changePassword(): void {
    alert('Changing password');
    this.router.navigate(['/change-password']);
  }

  async changeRole(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;

    // Actualiza solo el formulario para que saveChanges sincronice después con userVista
    this.form.patchValue({ role: selectedRole === 'ADMIN' ? Role.ADMIN : Role.CLIENT });
  }

  saveChanges() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.form.invalid) {
      this.form.markAsTouched();
      return;
    }

    // Actualizar `userVista` con los valores del formulario
    const formValues = this.form.getRawValue();
    this.userVista.set({
      ...this.userVista(),
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dni: formValues.dni,
      phone: formValues.phone,
      role: formValues.role,  // Asegúrate de que `role` esté actualizado aquí
      picture: this.userVista().picture,  // Mantener la imagen existente
      email: this.userVista().email  // Mantener el email existente si es necesario
    });

    // Verificación en la consola para confirmar los datos que se enviarán
    console.log('Datos a enviar (userVista):', this.userVista());

    this.userService.updateUser(this.userVista()).subscribe({
      next: (updatedUser: UserModel) => {
        console.log('Usuario actualizado:', updatedUser);
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

  changePicture() {
    alert("Insert the new picture");
  }

  showText(isHovering: boolean) {
    this.isHovering = isHovering;
  }
}
