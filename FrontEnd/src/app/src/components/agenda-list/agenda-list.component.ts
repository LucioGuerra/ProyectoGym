import {ChangeDetectionStrategy, Component, Input, signal, OnInit, ChangeDetectorRef} from '@angular/core';
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
import {AppointmentService} from "../services/services";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
export class AgendaListComponent implements OnInit {
    displayedColumns: string[] = ['date', 'activity', 'capacity', 'actions'];

    /*public appointments: Appointment[] = [];*/

    @Input() selectedActivities = signal<string[]>([]);
    @Input() appointmentList = signal<Appointment[]>([]);
    @Input() isAdmin: boolean = false;


    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router, 
        private dialog: MatDialog, 
        private appointmentService: AppointmentService,
        private snackbar: MatSnackBar,
    ) {
    }

    ngOnInit() {
        if (!this.isAdmin) {
            this.displayedColumns = ['date', 'activity', 'capacity'];
        }
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
        dialogConfig.maxWidth = '1400px';
        if (this.isAdmin) {
            dialogConfig.width = '90%';
            dialogConfig.height = '80%';
        } else {
            dialogConfig.width = '40%';
        }
        dialogConfig.data = {id: appointment.id, isAdmin: this.isAdmin};
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
        console.log('Canceling appointment', appointment.id);
        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: '¿Estás seguro de que deseas cancelar la cita?'
            }
        }).afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.appointmentService.cancelAppointment(appointment.id.toString()).subscribe(
                    (response) => {
                        console.log('Appointment canceled: ', response);
                        this.snackbar.open('Cita cancelada', 'Cerrar', {
                            duration: 3000,
                            horizontalPosition: 'center',
                            verticalPosition: 'top'
                        });
                        this.appointmentList.set(this.appointmentList().filter(a => a.id !== appointment.id));
                    },
                    (error) => {
                        console.log('Error canceling appointment', error);
                        let dialogConf = new MatDialogConfig();
                        dialogConf.data = {
                            message: 'Ha ocurrido un error, por favor intentelo mas tarde.'
                        };
                        let d = this.dialog.open(ErrorDialogComponent, dialogConf);
                    }
                );
            }
        })
    }
}
