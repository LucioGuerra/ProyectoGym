import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, ViewChild} from '@angular/core';
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
import {NgIf} from "@angular/common";
import {UserService} from "../services/services/user.service";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../dialog/error-dialog/error-dialog.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments';
import {lastValueFrom} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

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
    MatInput,
    MatFormField,
    MatLabel,
    MatError,
    NgIf],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserEditComponent {
  user = signal<User>({});
  found = signal<boolean>(false);
  defaultImage = 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  id: string | null = '';
  imageFile: string = '';
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
    picture: new URL(this.defaultImage),
  });
  userVista = signal<UserModel>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: Role.CLIENT,
    phone: '',
    dni: '',
    picture: new URL(this.defaultImage),
  });
  protected readonly Role = Role;
  private _snackBar = inject(MatSnackBar);
  private dialogConfig = new MatDialogConfig();


  constructor(public auth: AuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private http: HttpClient,
  ) {
    console.log(this.user().picture);

    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      picture: new FormControl(''),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      phone: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(11)]),
    });
    effect(() => {
      if (!this.auth.isAuthenticated()) {
          this.router.navigate(['/home']);
        }
    });
  }

  ngOnInit() {
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

    if (this.form.dirty) {
      this.dialog.open(ConfirmationDialogComponent, {data: {message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.'}}).afterClosed().subscribe((result: boolean) => {
        if (result) {
          if (previousUrl !== '/user-info' && !isAdmin) {
            this.router.navigate(['/user-info']);
          } else if (isAdmin) {
            window.history.back();
          }
        }
      });
    } else {
      if (previousUrl !== '/user-info' && !isAdmin) {
        this.router.navigate(['/user-info']);
      } else if (isAdmin) {
        window.history.back();
      }
    }
  }

  async changePassword() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Se te enviará un email para restablecer tu' +
          ' contraseña. ¿Estás seguro de que quieres cambiar tu contraseña?'
      }
    }).afterClosed().subscribe((result: boolean) => {
      if (!result) {
        return;
      }
      this.auth.forgotPassword(this.user().email!);
    });
  }

  async changeRole(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;

    // Actualiza solo el formulario para que saveChanges sincronice después con userVista
    this.form.patchValue({role: selectedRole === 'ADMIN' ? Role.ADMIN : Role.CLIENT});
  }

  async saveChanges() {
    console.log('img', this.imageFile);
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.form.invalid) {
      console.log('invalido')
      this.form.markAsTouched();
      return;
    }

    await this.uploadImage();

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
        const s = this._snackBar.open("Se ha modificado correctamente el usuario", "Cerrar", {
          duration: 2000,
        });
      },
      error: (error: any) => {
        this.dialog.open(ErrorDialogComponent, { data: { message: "Este DNI ya pertenece a otro usuario." } });
      },
      complete: () => {
        console.log('Update user completed');
      }
    });
  }

  showText(isHovering: boolean) {
    this.isHovering = isHovering;
  }

  // Dispara el clic en el input oculto
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Maneja la selección del archivo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.dialogConfig.autoFocus = true;
        this.dialogConfig.maxWidth = '1400px';
        this.dialogConfig.width = '40%';
        this.dialogConfig.panelClass = 'custom-dialog';
        this.dialogConfig.data = {message: 'El archivo seleccionado no es una imagen.'};
        const dialogRef = this.dialog.open(ErrorDialogComponent, this.dialogConfig);
        return;
      }

      const maxSizeInMB = 2;
      if (file.size / 1024 / 1024 > maxSizeInMB) {

        this.dialogConfig.data = {message: `La imagen excede el tamaño maximo de ${maxSizeInMB}MB.`};
        const dialogRef = this.dialog.open(ErrorDialogComponent, this.dialogConfig);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.userVista.set({...this.userVista(), picture: new URL(reader.result as string)});
        console.log('Imagen:', reader.result);
        this.imageFile = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<void> {
    if (this.imageFile) {
      console.log('entrando a uploadImage');
      const formData = new FormData();
      formData.append('file', this.imageFile);
      formData.append('upload_preset', environment.cloudinary.preset);

      try {
        const response: any = await lastValueFrom(this.http.post(environment.cloudinary.api, formData));
        console.log('Imagen cargada con éxito:', response);
        this.userVista.set({...this.userVista(), picture: new URL(response.secure_url)});
        console.log('Imagen cargada:', this.userVista().picture);
      } catch (error) {
        this.dialogConfig.autoFocus = true;
        this.dialogConfig.maxWidth = '1400px';
        this.dialogConfig.width = '40%';
        this.dialogConfig.panelClass = 'custom-dialog';
        this.dialogConfig.data = {message: 'Ha habido un error, por favor intentelo mas tarde.'};
        const dialogRef = this.dialog.open(ErrorDialogComponent, this.dialogConfig);
        console.error('Error al cargar la imagen:', error);
      }
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }
}
