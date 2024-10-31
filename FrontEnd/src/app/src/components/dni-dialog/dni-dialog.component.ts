import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AppointmentInfoDialogComponent} from "../appointment-info-dialog/appointment-info-dialog.component";

@Component({
  selector: 'app-dni-dialog',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './dni-dialog.component.html',
  styleUrl: './dni-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DniDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AppointmentInfoDialogComponent>){}

  dni: string = '';

  @Output() dniSubmitted = new EventEmitter<string>();


  submitDni() {
    this.dniSubmitted.emit(this.dni);
    this.dialogRef.close(this.dni);
  }

}
