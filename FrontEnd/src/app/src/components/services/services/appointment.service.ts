import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Appointment, AppointmentRequest, KineModel, UserModel} from '../../index'; // Ajusta según tus rutas
import {interval, Observable, Subject, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../../index';
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  private appointmentChangedSource = new Subject<void>();
  appointmentChanged$ = this.appointmentChangedSource.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.startPolling();
  }

  // Iniciar polling para obtener citas cada cierto tiempo
  startPolling() {
    // Emitir actualizaciones cada 1 segundos
    interval(1000)
      .pipe(// Llamar al servidor para obtener citas
      )
      .subscribe(() => {
          // this.appointmentChangedSource.next(); // Emitir las citas actualizadas
        },
      );
  }


  notifyAppointmentChanged() {+
    console.log('Notificando cambio en las citas');
    this.appointmentChangedSource.next();
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((appointments: any[]) => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
      })))
    );
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    console.log('Fecha en el servicio:', this.dateAdapt(date));
    return this.http.get<Appointment[]>(`${this.apiUrl}/date/${this.dateAdapt(date)}`).pipe(
      map((appointments: any[]) => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
        max_capacity: appointment.max_capacity || 0,
        startTime: appointment.startTime.split(':').slice(0, 2).join(':') || '',
        endTime: appointment.endTime.split(':').slice(0, 2).join(':') || '',
      })))
    );
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`).pipe(
      map(appointment => ({
        ...appointment,
        date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
        max_capacity: appointment.max_capacity || 0,
        startTime: appointment.startTime.split(':').slice(0, 2).join(':') || '',
        endTime: appointment.endTime.split(':').slice(0, 2).join(':') || '',
      }))
    );
  }

  createAppointment(appointment: AppointmentRequest): any {
    return this.http.post<any>(this.apiUrl, appointment);
  }

  updateAppointment(id: string, appointment: AppointmentRequest): any {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, appointment);
  }

  createKinesiologyAppointments(appointmentData: AppointmentRequest): any {
    return this.http.post<any>(`${this.apiUrl}/kine`, appointmentData);
  }


  async addUserToKinesiologyAppointment(appointmentId: string, userEmail: string, kinesiologo: UserModel): Promise<Observable<any>> {
    console.log('Agregando usuario a la cita de kinesiología, id:', appointmentId, 'email:', userEmail, 'kinesiologo:', kinesiologo);
    this.http.patch<any>(`${this.apiUrl}/${appointmentId}`, {kinesiologo: kinesiologo, updateAllFutureAppointments:false}).subscribe(
      () => {
        console.log('Instructor asignado a la cita de kinesiología');
      },
      error => {
        console.error('Error al asignar el instructor a la cita de kinesiología:', error);
      }
    );
    return this.reserveAppointment(appointmentId, userEmail);
  }

  getKinesiologyAppointmentsByDate(date: Date) {
    return this.http.get<Appointment[]>(`${this.apiUrl}/kine/date/${this.dateAdapt(date)}`).pipe(
      map((appointments: any[]) => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
        max_capacity: appointment.max_capacity || 0,
        startTime: appointment.startTime.split(':').slice(0, 2).join(':') || '',
        endTime: appointment.endTime.split(':').slice(0, 2).join(':') || '',
      })))
    );
  }

  switchUserAttendance(appointmentId: string, userId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${appointmentId}/user/${userId}/attendance`, {});
  }

  cancelAppointment(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  dateAdapt(date: Date): string {
    return date.toLocaleString("es-AR").split(",")[0].split('/').map(part => part.length === 1 ? '0' + part : part).reverse().join('-');
  }

  reserveAppointment(appointmentID: string, userEmail: string): Observable<any> {
    return this.userService.getUserByEmail(userEmail).pipe(
      switchMap(user => this.http.post<any>(`${this.apiUrl}/${appointmentID}/user/${user.id}`, {}))
    );
  }


  unreserveAppointment(appointmentID: string, userEmail: string): Observable<any> {
    return this.userService.getUserByEmail(userEmail).pipe(
      switchMap(user => this.http.delete<any>(`${this.apiUrl}/${appointmentID}/user/${user.id}`))
    );
  }

  removeInstructorFromKinesiologyAppointment(appointmentId: string) {
    return this.http.patch<any>(`${this.apiUrl}/${appointmentId}`, {
      "instructorID": "-1",
      "updateAllFutureAppointments": false
    }).subscribe(
      () => {
        console.log('Instructor eliminado de la cita de kinesiología');
      },
      error => {
        console.error('Error al eliminar el instructor de la cita de kinesiología:', error);
      }
    );
  }
}
