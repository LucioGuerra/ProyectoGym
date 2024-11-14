import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, effect, OnInit,
  signal
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from '../../components';
import {MatCardModule} from '@angular/material/card';
import {ActivityService, Appointment, AppointmentService, ToolbarComponent} from '../../components';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipListboxChange, MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {Activity} from '../../components';
import {Router} from "@angular/router";
import {MatTableModule} from '@angular/material/table';
import {AgendaListComponent} from "../../components/agenda-list/agenda-list.component";

@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [MatTabsModule, MatTableModule, MatMenuModule, MatProgressBarModule, MatChipsModule, MatListModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, DrawerComponent, AgendaListComponent],
  templateUrl: './shif-admin-screen.component.html',
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},],
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent implements OnInit {

  public activities: Activity[] = [];

  public appointments: Appointment[] = [];

  public selectedDate = signal<Date>(this.getStoredDate());
  public selectedActivities = signal<string[]>([]);
  public appointmentList = signal<Appointment[]>([]);
  kinesiology= signal<string[]>(['Kinesiology', 'Kinesiologia']);
  public tabIndex = signal<number>(0);


  constructor(private changeDetectorRef: ChangeDetectorRef, protected auth0: AuthService, private router: Router, private appointmentService: AppointmentService, private activityService: ActivityService) {
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
      this.saveStoredDate(this.selectedDate());
    });
    console.log('is admin? ', this.auth0.isAdmin(), 'is client? ', this.auth0.isClient());
  }

  ngOnInit(): void {
    this.loadAppointment(this.tabIndex());
    this.loadActivities();
    this.appointmentService.appointmentChanged$.subscribe(() => {
      console.log('Cambios en los appointments detectados. Recargando...');
      this.loadAppointment(this.tabIndex());  // Recargamos los appointments
      this.changeDetectorRef.markForCheck();  // Forzar la detección de cambios
    });
  }

  loadAppointment(tabIndex: number) {
    if (tabIndex == undefined || tabIndex == 0) {
      console.log('Cargando citas de fisioterapia');
      this.appointmentService.getAppointmentsByDate(this.selectedDate()).subscribe(
        (data: Appointment[]) => {
          console.log('Datos en el componente:', data);
          this.appointments = data;
          this.appointmentList.set(data);
          this.changeDetectorRef.markForCheck();
        },
        (error) => {
          console.error('Error al obtener las citas', error);
        }
      );
    } else {
      console.log('Cargando citas de kinesiología');
      this.appointmentService.getKinesiologyAppointmentsByDate(this.selectedDate()).subscribe(
        (data: Appointment[]) => {
          console.log('Datos en el componente:', data);
          this.appointments = data;
          this.appointmentList.set(data);
          this.changeDetectorRef.markForCheck();
        },
        (error) => {
          console.error('Error al obtener las citas', error);
        }
      );
    }
    return;
  }

  loadActivities() {
    this.activityService.getActivities().subscribe(
      (data: Activity[]) => {
        console.log('Datos en el componente:', data); // Aquí los datos ya fueron recibidos
        this.activities = data.filter(activity => activity.name !== 'Kinesiology' && activity.name !== 'Kinesiologia');
        this.selectedActivities.set(this.activities.map(activity => activity.name));
        this.changeDetectorRef.markForCheck();
        console.log('Datos en el componente después de la asignación:', this.activities);
      },
      (error) => {
        console.error('Error al obtener las actividades', error);
      }
    );
  }

  saveStoredDate(date: Date) {
    localStorage.setItem('selectedDate', date.toISOString());
  }

  getStoredDate(): Date {
    const date = localStorage.getItem('selectedDate');
    return date ? new Date(date) : new Date(new Date(Date.now()).setHours(0, 0, 0, 0));
  }

  datePickerChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate.set(event.value!);
    console.log('index:', this.tabIndex());
    this.loadAppointment(this.tabIndex());
    // alert(`date: ${this.selectedDate().toLocaleDateString()}, apointements: ${this.apointments[0].date} son iguales? ${this.selectedDate().toDateString() == this.apointments[0].date.toDateString()}`);
  }

  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    // this.selectedActivities.update(selectedActivities => [...selectedActivities, $event.value]);
    this.selectedActivities.set($event.value);
    this.appointmentList.set(this.appointments.filter(appointment => this.selectedActivities().includes(appointment.activity)));
    // alert(`quantity selectioned: ${this.selectedActivities().length}, activities: ${this.selectedActivities()}`);
  }


  newShift($event: MouseEvent) {
    this.router.navigate(['/admin/appointment/create']);
  }

  newActivity($event: MouseEvent) {
    this.router.navigate(['/admin/activity/create'])
  }

  newPackage($event: MouseEvent) {
    this.router.navigate(['/package/create'])
  }

  newSale($event: MouseEvent) {
    alert('new sale');
  }

  shop($event: MouseEvent) {
    this.router.navigate(['/admin/ecommerce']);
  }

  onTabChange($event: MatTabChangeEvent) {
    /*this.tabIndex = $event.index;*/
    console.log('Tab changed:', $event.index);
    this.loadAppointment($event.index);
  }

  goBackDate($event: MouseEvent) {
    this.selectedDate.set(new Date(this.selectedDate().setDate(this.selectedDate().getDate() - 1)));
    this.loadAppointment(this.tabIndex());
  }

  gofurtherDate($event: MouseEvent) {
    this.selectedDate.set(new Date(this.selectedDate().setDate(this.selectedDate().getDate() + 1)));
    this.loadAppointment(this.tabIndex());
  }

  onAppointmentsUpdated() {
    console.log('entra a onAppointmentsUpdated, index:', this.tabIndex());
    this.loadAppointment(this.tabIndex());
    this.changeDetectorRef.markForCheck()// Recargar appointments cuando sea necesario
  }
}
