import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CreatePackage} from "../../layout/create-package/create-package";
import {CreateAppointmentFormComponent} from "../create-appointment-form/create-appointment-form.component";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Activity, UserModel} from "../models";
import {ActivityService} from "../services/services";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {UserService} from "../services/services/user.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable, startWith} from "rxjs";
import {User} from "@auth0/auth0-angular";
import {map} from "rxjs/operators";
import {Router} from '@angular/router';
import {ActivityPackage, Package} from "../models/package.models";
import {PackageService} from "../services/services/package.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creat-package-form',
  standalone: true,
  imports: [
    CreatePackage,
    CreateAppointmentFormComponent,
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './creat-package-form.component.html',
  styleUrl: './creat-package-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatPackageFormComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  activities: Activity[] = [];
  users: UserModel[] = [];
  filteredOptions: Observable<UserModel[]> = new Observable<UserModel[]>();

  // Definimos un FormGroup que contiene el FormArray de actividades
  packageForm: FormGroup = new FormGroup({
    packageName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    packageDescription: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    myControl: new FormControl('', [Validators.required]), // Autocomplete para el usuario
    activitiesArray: new FormArray([]) // FormArray para las actividades
  });

  constructor(
    private packageService: PackageService,
    private activityService: ActivityService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadActivities();
    this.filteredOptions = this.packageForm.controls['myControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    // Inicializar el primer conjunto de actividad y cantidad
    this.addActivity();
  }

  // Cargar lista de usuarios
  private loadUsers() {
    this.userService.getAllUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        let dialogConf = new MatDialogConfig();
        dialogConf.data = {
          message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
        };
        let d = this.dialog.open(ErrorDialogComponent, dialogConf);
        d.afterClosed().subscribe(() => {
          this.router.navigate(['/admin/agenda']);
        });
        alert(`Error al cargar usuarios: ${error}`);
      }
    );
  }

  // Cargar lista de actividades
  private loadActivities() {
    this.activityService.getActivities().subscribe(
      activities => {
        this.activities = activities
      },
      error => {
        let dialogConf = new MatDialogConfig();
        dialogConf.data = {
          message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
        };
        let d = this.dialog.open(ErrorDialogComponent, dialogConf);
        d.afterClosed().subscribe(() => {
          this.router.navigate(['/admin/agenda']);
        });
        console.log(`Error al cargar actividades: ${error}`);
      }
    );
  }

  // Getter para facilitar el acceso al FormArray
  get activitiesArray(): FormArray {
    return this.packageForm.get('activitiesArray') as FormArray;
  }

  // Agregar una nueva actividad y cantidad como FormGroup
  addActivity() {
    const activityControl = new FormControl(-1, [Validators.required, Validators.min(1)]); // Control para la actividad seleccionada
    const quantityControl = new FormControl(1, [Validators.required, Validators.min(1)]); // Control para la cantidad de clases semanales

    const activityGroup = new FormGroup({
      activityId: activityControl,
      quantity: quantityControl
    });

    this.activitiesArray.push(activityGroup); // Añadir el FormGroup al FormArray
  }

  // Eliminar una actividad
  removeActivity(index: number) {
    if (this.activitiesArray.length > 1) {
      this.activitiesArray.removeAt(index);
    }
  }

  // Filtrar usuarios por DNI
  private _filter(dni: string): UserModel[] {
    const filterValue = dni.toLowerCase();
    return this.users.filter(user => user.dni.toLowerCase().includes(filterValue));
  }

  // Mostrar nombre completo en autocompletado
  displayUser(user: UserModel): string {
    return user && user.firstName ? `${user.firstName} ${user.lastName}` : '';
  }

  // Crear el paquete
  createPackage() {
    const activities = this.activitiesArray.controls.map(control => {
      const group = control as FormGroup;
      return {
        activityId: group.get('activityId')?.value,
        quantity: group.get('quantity')?.value
      };
    });

      const packageData = {
        name: this.packageForm.get('packageName')?.value,
        description: this.packageForm.get('packageDescription')?.value,
        userId: this.packageForm.get('myControl')?.value.id, // Obtener el ID del usuario seleccionado
        activities
      };

      this.packageService.createPackage(packageData).subscribe(
        response => {
          this._snackBar.open(`Se ha creado el paquete correctamente`, "Cerrar", {"duration": 3000, "horizontalPosition": "center", "verticalPosition": "top"})
          console.log(`Paquete creado: ${response}`);
        },
        error => {
          this._snackBar.open('Ha ocurrido un error, por favor intentelo mas tarde', "Cerrar", {"duration": 5000, "horizontalPosition": "center", "verticalPosition": "top"})
          console.log(`Error al crear paquete: ${error}`);
        }
      );
    }

  // Navegar de vuelta a la agenda
  return() {
    this.router.navigate(['/admin/agenda']);
  }
}
