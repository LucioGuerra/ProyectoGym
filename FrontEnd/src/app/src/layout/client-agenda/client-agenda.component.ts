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
import {AnnouncementCarouselComponent} from "../../components/announcement-carousel/announcement-carousel.component";

@Component({
  selector: 'app-client-agenda',
  standalone: true,
  imports: [
    AgendaListComponent,
    DrawerComponent,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatTabsModule,
    ToolbarComponent,
    MatChipsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatMenuModule,
    MatTableModule,
    MatDatepickerModule,
    AnnouncementCarouselComponent,
  ],
  templateUrl: './client-agenda.component.html',
  styleUrl: './client-agenda.component.scss',
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientAgendaComponent implements OnInit {

  public activities: Activity[] = [];

  public appointments: Appointment[] = [];

  public selectedDate = signal<Date>(new Date());
  public selectedActivities = signal<string[]>([]);
  public appointmentList = signal<Appointment[]>([]);
  kinesiology = signal<string[]>(['Kinesiology', 'Kinesiologia']);
  public tabIndex = signal<number>(0);
  readonly today: Date = new Date();


  constructor(private changeDetectorRef: ChangeDetectorRef, protected auth0: AuthService, private router: Router, private appointmentService: AppointmentService, private activityService: ActivityService) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isClient()) {
          console.log('Usuario autenticado, es admin? ', this.auth0.isAdmin(), 'es cliente? ', this.auth0.isClient());
        } else if (this.auth0.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit(): void {
    this.loadAppointment(this.tabIndex());
    this.loadActivities();
    console.log('Fecha seleccionada:', this.selectedDate());
    console.log('today: ', this.today);
  }

  loadAppointment(tabIndex: number) {
    if (tabIndex == undefined || tabIndex == 0) {
      console.log('Cargando citas de todas las actividades');
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
    alert('new activity');
  }

  newUser($event: MouseEvent) {
    alert('new user');
  }

  newSale($event: MouseEvent) {
    alert('new sale');
  }

  shop($event: MouseEvent) {
    alert('shop');
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
}
