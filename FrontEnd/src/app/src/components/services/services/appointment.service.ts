import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment, AppointmentRequest } from '../../index'; // Ajusta según tus rutas
import { Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../index';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((appointments: any[]) => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
      })))
    );
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    console.log('Fecha en el servicio:', date.toISOString().split('T')[0]);
    return this.http.get<any[]>(`${this.apiUrl}/date/${date.toISOString().split('T')[0]}`).pipe(
      map((appointments: any[]) => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
      })))
    );
  }

}
