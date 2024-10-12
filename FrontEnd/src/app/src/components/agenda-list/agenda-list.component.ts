import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {MatActionList, MatListItem} from "@angular/material/list";
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatRow, MatRowDef, MatTable} from "@angular/material/table";
import {MatChip} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {Appointment} from "../models";
import {Router} from "@angular/router";
import {ErrorDialogComponent} from "../dialog/error-dialog/error-dialog.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AppointmentInfoDialogComponent} from "../appointment-info-dialog/appointment-info-dialog.component";

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [
    MatActionList,
    MatCell,
    MatCellDef,
    MatChip,
    MatColumnDef,
    MatHeaderCell,
    MatIcon,
    MatIconButton,
    MatListItem,
    MatMenu,
    MatMenuItem,
    MatProgressBar,
    MatRow,
    MatRowDef,
    MatTable,
    MatMenuTrigger
  ],
  templateUrl: './agenda-list.component.html',
  styleUrl: './agenda-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaListComponent {
  displayedColumns: string[] = ['date', 'activity', 'capacity', 'actions'];

  public appointments: Appointment[] = [];

  @Input() selectedActivities = signal<string[]>([]);
  @Input() appointmentList = signal<Appointment[]>([]);

  constructor(private router: Router, private dialog: MatDialog) {

  }

  noActivities(): boolean {
    if (this.appointmentList().length === 0) {
      return true;
    }

    return this.appointmentList().filter(appointment =>
      this.selectedActivities().includes(appointment.activity)
    ).length === 0;
  }

  open_appointment($event: Event, appointment: Appointment) {
    $event.stopPropagation();
    $event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1400px';
    dialogConfig.height = '80%';
    dialogConfig.data = { id: appointment.id };
    dialogConfig.panelClass = 'custom-dialog';
    this.dialog.open(AppointmentInfoDialogComponent, dialogConfig);
  }

  edit_appointment($event: Event, appointmentID: number) {
    $event.stopPropagation();
    $event.preventDefault();
    this.router.navigate([`/admin/appointment/edit/${appointmentID}`]);
  }

  cancel_appointment($event: MouseEvent, appointment: Appointment) {
    $event.stopPropagation();
    $event.preventDefault();
    alert(`canceling appointment id: ${appointment.id}`);
  }
}
