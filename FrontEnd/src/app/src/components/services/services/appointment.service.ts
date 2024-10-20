import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Appointment, AppointmentRequest} from '../../index'; // Ajusta según tus rutas
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../../index';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {
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

  switchUserAttendance(appointmentId: string, userId: number, attendance: boolean) {
    return this.http.post<any>(`${this.apiUrl}/${appointmentId}/user/${userId}/attendance`, {});
  }

  cancelAppointment(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  dateAdapt(date: Date): string {
    return date.toLocaleString("es-AR").split(",")[0].split('/').map(part => part.length === 1 ? '0' + part : part).reverse().join('-');
  }
}
