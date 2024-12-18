import {ChangeDetectionStrategy, Component, effect, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {CreatePackage} from "../../layout/create-package/create-package";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {FormControl, Validators, ReactiveFormsModule} from "@angular/forms";
import {Activity} from "../models";
import {ActivityService, AuthService} from "../services/services";
import {ActivatedRoute, Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';
import { MainScreenComponent } from "../../layout/main-screen/main-screen.component";
import { CreateAppointmentFormComponent } from "../create-appointment-form/create-appointment-form.component";
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [
    AsyncPipe,
    CreatePackage,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    MainScreenComponent,
    CreateAppointmentFormComponent
],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateActivityComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  activityId: string | null = null;
  activityName = new FormControl('', Validators.required);
  activityDescription = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]);
  activityPrice = new FormControl<number>(1000.0, [Validators.required, Validators.min(1)]);

  constructor(private activityService: ActivityService,
              private auth0: AuthService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
        } else if (this.auth0.isClient()) {
          this.router.navigate(['/agenda']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    console.log('is admin? ', this.auth0.isAdmin(), 'is client? ', this.auth0.isClient());
  }

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('id');
    this.loadActivity();
  }

  loadActivity() {
    if (this.activityId) {
      this.activityService.getActivitybyId(this.activityId).subscribe(
        (activity: Activity) => {
          this.activityName.setValue(activity.name);
          this.activityDescription.setValue(activity.description!);
          this.activityPrice.setValue(activity.price!);
        },
        (error) => {
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
  }

  create() {
    console.log(this.activityName.value);
    console.log(this.activityDescription.value);
    console.log(this.activityPrice.value);
    if (this.activityName.valid && this.activityDescription.valid && this.activityPrice.valid) {
      let createdActivity: Activity = {
        name: this.activityName.value!,
        description: this.activityDescription.value!,
        price: this.activityPrice.value!
      }
      console.log(createdActivity);
      this.activityService.createActivity(createdActivity).subscribe(
        (response) => {
          this._snackBar.open(`Se ha creado la actividad correctamente`, "Cerrar", {"duration": 3000, "horizontalPosition": "center", "verticalPosition": "top"})
          console.log(`Actividad creada: ${response}`);
          this.activityDescription.markAsPristine();
          this.activityName.markAsPristine();
          this.activityPrice.markAsPristine();
        },
        (error) => {
          this._snackBar.open('Ha ocurrido un error, por favor intentelo mas tarde', "Cerrar", {"duration": 5000, "horizontalPosition": "center", "verticalPosition": "top"})
          console.log(`Error al crear la actividad: ${error}`);
        }
      );
    } else {
      this.activityName.markAsDirty();
      this.activityDescription.markAsDirty();
      this.activityPrice.markAsDirty();
    }
  }

  return() {
    if (this.activityName.dirty || this.activityDescription.dirty || this.activityPrice.dirty) {
      this.dialog.open(ConfirmationDialogComponent, {data: {message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.'}}).afterClosed().subscribe((result: boolean) => {
        if (result) {
          window.history.back();
        }
      });
    } else {
      window.history.back();
    }
  }

  edit() {
    console.log(this.activityName.value);
    console.log(this.activityDescription.value);
    console.log(this.activityPrice.value);
    if (this.activityId && this.activityName.valid && this.activityDescription.valid && this.activityPrice.valid) {
      let createdActivity: Activity = {
        name: this.activityName.value!,
        description: this.activityDescription.value!,
        price: this.activityPrice.value!
      }
      this.activityService.editActivity(this.activityId, createdActivity).subscribe(
        (response) => {
          this._snackBar.open('La actividad se ha editado correctamente', "Cerrar", {"duration": 3000, "horizontalPosition": "center", "verticalPosition": "top"})
          console.log(`Actividad editada: ${response}`);
          this.activityDescription.markAsPristine();
          this.activityName.markAsPristine();
          this.activityPrice.markAsPristine();
        },
        (error) => {
          this._snackBar.open('Ha ocurrido un error, por favor intentelo mas tarde', "Cerrar", {"duration": 5000, "horizontalPosition": "center", "verticalPosition": "top"})
          console.log(`Error al crear la actividad: ${error}`);
        }
      );
    } else {
      this.activityName.markAsDirty();
      this.activityDescription.markAsDirty();
      this.activityPrice.markAsDirty();
    }
  }
}
