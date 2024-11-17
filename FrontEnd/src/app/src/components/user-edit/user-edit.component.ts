import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Role, UserModel } from '../models';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DrawerComponent } from '../drawer/drawer.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { AuthService } from "../services/services/auth.service";
import { User } from "@auth0/auth0-angular";
import { NgIf, TitleCasePipe } from "@angular/common";
import { UserService } from "../services/services/user.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';
import { lastValueFrom } from 'rxjs';

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
  defaultImage = 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  id: string = '';
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
  protected readonly Role = Role;

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
      dni: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.userService.getUserById(this.id).subscribe({
        next: (userModel) => {
          this.form.patchValue(userModel);
          this.userModel.set(userModel);

          this.found.set(true);
          console.log(this.found());
        }, error: (error) => {
          console.error('User not found');
        }
      });
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
    this.form.patchValue({ role: selectedRole });
  }

  async saveChanges() {
    console.log('img', this.imageFile);
    if (this.form.invalid) {
      console.log('invalido')
      this.form.markAsTouched();
      return;
    } else if (this.form.valid) {
      console.log('valido')
      await this.uploadImage(); // Carga la imagen antes de guardar los datos
      console.log('user picture:', this.userModel().picture);
      this.userModel.set({
        ...this.userModel(),
        ...this.form.value,
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
        this.dialogConfig.data = { message: 'El archivo seleccionado no es una imagen.' };
        const dialogRef = this.dialog.open(ErrorDialogComponent, this.dialogConfig);
        return;
      }

      const maxSizeInMB = 2;
      if (file.size / 1024 / 1024 > maxSizeInMB) {
        
        this.dialogConfig.data = { message:`La imagen excede el tamaño maximo de ${maxSizeInMB}MB.` };
        const dialogRef = this.dialog.open(ErrorDialogComponent, this.dialogConfig);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.userModel.set({ ...this.userModel(), picture: new URL(reader.result as string) });
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
        this.form.patchValue({ picture: new URL(response.secure_url) });
        console.log('Imagen cargada:', this.userModel().picture);
      } catch (error) {
        this.dialogConfig.autoFocus = true;
        this.dialogConfig.maxWidth = '1400px';
        this.dialogConfig.width = '40%';
        this.dialogConfig.panelClass = 'custom-dialog';
        this.dialogConfig.data = { message: 'Ha habido un error, por favor intentelo mas tarde.' };
        const dialogRef = this.dialog.open(ErrorDialogComponent, this.dialogConfig);
        console.error('Error al cargar la imagen:', error);
      }
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }
}
