import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
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

  constructor(
    public dialogRef: MatDialogRef<DniDialogComponent>,
    private dniService: DniService){}

  dni = new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(9)]);

  @Output() dniSubmitted = new EventEmitter<string>();

  submitDni() {
    if (this.dni.valid) {
      this.dniService.setDni(this.dni.value!);
      this.dialogRef.close();
    } else {
      this.dni.markAsDirty();
    }
  }
}
