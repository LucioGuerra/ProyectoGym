import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatError, MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { NgIf } from "@angular/common";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import {DniService} from "../services/dni/dni.service";

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
    ){
    if (data && data.apellido) {
      this.apellido.setValue(data.apellido);
      this.apellido.disable();
    }
    if (data && data.nombre) {
      this.nombre.setValue(data.nombre);
      this.nombre.disable();
    }
  }


  submitDni() {
    if (this.dni.valid && this.apellido.valid && this.nombre.valid) {
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
}
