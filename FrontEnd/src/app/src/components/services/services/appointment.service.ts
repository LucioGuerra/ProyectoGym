import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment, AppointmentRequest, KineModel, UserModel } from '../../index'; // Ajusta según tus rutas
import {catchError, interval, Observable, Subject, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../index';
import { UserService } from "./user.service";
import {ErrorDialogComponent} from "../../dialog/error-dialog/error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
    private dialog: MatDialog
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


  notifyAppointmentChanged() {
    +
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
    return this.http.post<any>(this.apiUrl+"/admin", appointment);
  }

  updateAppointment(id: string, appointment: AppointmentRequest): any {
    return this.http.patch<any>(`${this.apiUrl+"/public"}/${id}`, appointment);
  }

  createKinesiologyAppointments(appointmentData: AppointmentRequest): any {
    return this.http.post<any>(`${this.apiUrl+"/public"}/kine`, appointmentData);
  }


  async addUserToKinesiologyAppointment(appointmentId: string, userEmail: string, kinesiologo: UserModel): Promise<Observable<any>> {
    console.log('Agregando usuario a la cita de kinesiología, id:', appointmentId, 'email:', userEmail, 'kinesiologo:', kinesiologo);
    return new Observable(observer => {
      this.http.patch<any>(`${this.apiUrl}/public/${appointmentId}`, { kinesiologo: kinesiologo, updateAllFutureAppointments: false }).subscribe(
        () => {
          console.log('Instructor asignado a la cita de kinesiología');
          this.reserveAppointment(appointmentId, userEmail).subscribe(
            reservation => {
              observer.next(reservation);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          console.error('Error al asignar el instructor a la cita de kinesiología:', error);
          observer.error(error);
        }
      );
    });
  }

  getKinesiologyAppointmentsByDate(date: Date) {
    return this.http.get<Appointment[]>(`${this.apiUrl+"/public"}/kine/date/${this.dateAdapt(date)}`).pipe(
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
    return this.http.post<boolean>(`${this.apiUrl+"/admin"}/${appointmentId}/user/${userId}/attendance`, {});
  }

  cancelAppointment(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/${id}/deleteAllFutureAppointments=${false}`);
  }

  dateAdapt(date: Date): string {
    return date.toLocaleString("es-AR").split(",")[0].split('/').map(part => part.length === 1 ? '0' + part : part).reverse().join('-');
  }

  reserveAppointment(appointmentID: string, userEmail: string): Observable<any> {
    return this.userService.getUserByEmail(userEmail).pipe(
      switchMap(user => this.http.post<any>(`${this.apiUrl}/${appointmentID}/user/${user.id}`, {})),
      catchError(error => {
        if (error.error.error === 'USER_HAS_NO_ACTIVITY') {
          this.dialog.open(ErrorDialogComponent, {data: {message: "Su paquete no posee esta actividad"}});
        }
        if (error.error.error === 'USER_HAS_NO_ACTIVE_PACKAGE') {
          this.dialog.open(ErrorDialogComponent, {data: {message: "No posee un paquete activo"}});
        }
        if (error.error.error === 'USER_NO_CREDITS') {
          this.dialog.open(ErrorDialogComponent, {data: {message: "Su paquete no posee con los suficientes creditos para esta actividad"}});
        }
        if (error.error.error === 'USER_ALREADY_REGISTERED') {
          this.dialog.open(ErrorDialogComponent, {data: {message: "Ya se encuentra registrado en esta actividad"}});
        }
        if (error.error.error === 'APPOINTMENT_IS_FULL') {
          this.dialog.open(ErrorDialogComponent, {data: {message: "La actividad ya se encuentra llena"}});
        }
        return new Observable();
      })
      );
  }


  unreserveAppointment(appointmentID: string, userEmail: string): Observable<any> {
    return this.userService.getUserByEmail(userEmail).pipe(
      switchMap(user => this.http.delete<any>(`${this.apiUrl}/${appointmentID}/user/${user.id}`))
    );
  }

  unreserveKinesiologyAppointment(appointmentId: string, userEmail: string): Observable<any> {
    return new Observable(observer => {
      this.http.patch<any>(`${this.apiUrl}/public/${appointmentId}`, {
        "instructorID": "-1",
        "updateAllFutureAppointments": false
      }).subscribe(
        () => {
          console.log('Instructor eliminado de la cita de kinesiología');
          this.unreserveAppointment(appointmentId, userEmail).subscribe(
            result => {
              console.log('Cita de kinesiología desreservada');
              observer.next(result);
              observer.complete();
            },
            error => {
              console.error('Error al desreservar la cita de kinesiología:', error);
              observer.error(error);
            }
          );
        },
        error => {
          console.error('Error al eliminar el instructor de la cita de kinesiología:', error);
          observer.error(error);
        }
      );
    });
  }
}
