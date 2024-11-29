import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogConfig,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatError, MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { NgIf } from "@angular/common";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { DniService } from "../services/dni/dni.service";
import { UserService } from '../services/services/user.service';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';

@Component({
  selector: 'app-dni-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    MatError,
    MatFormField,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatDialogContent
  ],
  templateUrl: './dni-dialog.component.html',
  styleUrls: ['./dni-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DniDialogComponent {

  dni = new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(9)]);
  apellido = new FormControl('', [Validators.required, Validators.minLength(1)]);
  nombre = new FormControl('', [Validators.required, Validators.minLength(1)]);
  @Output() dniSubmitted = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DniDialogComponent>,
    private dniService: DniService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    if (data && data.apellido) {
      this.apellido.setValue(data.apellido);
      this.apellido.disable();
    }
    if (data && data.nombre) {
      this.nombre.setValue(data.nombre);
      this.nombre.disable();
    }
  }

  async submitDni() {
    await this.checkDNI();
    if (this.dni.valid && (this.apellido.disabled || this.apellido.valid) && (this.nombre.disabled || this.nombre.valid)) {
      this.dniService.setDni(this.dni.value!);
      this.dniService.setApellido(this.apellido.value!);
      this.dniService.setNombre(this.nombre.value!);
      this.dialogRef.close();
    } else {
      this.dni.markAsDirty();
      this.apellido.markAsDirty();
      this.nombre.markAsDirty();
      this.dni.markAsTouched();
      this.apellido.markAsTouched();
      this.nombre.markAsTouched();
    }
  }

  async checkDNI(): Promise<void> {
    console.log('El usuario escribió algo en el DNI');
    try {
      await this.userService.getUserByDNI(this.dni.value!).subscribe((user) => {
        console.log('se encontro un usuario');
        if (user) {
          let dconf = new MatDialogConfig();
          dconf.data = { message: `El DNI ${this.dni.value} ya se encuentra registrado` }
          dconf.autoFocus = true;
          dconf.viewContainerRef = this.viewContainerRef;
          let d = this.dialog.open(ErrorDialogComponent, dconf);
          d.afterClosed().subscribe(() => {
            this.dni.setValue('');
          });
        }
      });
    } catch (error) {
      let dconf = new MatDialogConfig();
      dconf.data = { message: `Lo sentimos, ha habido un error` }
      dconf.autoFocus = true;
      dconf.viewContainerRef = this.viewContainerRef;
      let d = this.dialog.open(ErrorDialogComponent, dconf);
    }
  }

  onDniBlur() {
    console.log('El usuario dejó de tener foco en el DNI');
    if (!this.dni.valid) {
      return;
    }
    this.checkDNI();
  }
}
