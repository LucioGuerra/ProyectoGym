import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppointmentRequest, environment} from '../../index';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor( private http: HttpClient ) { }

  getAllAppointment() {
    return this.http.get(this.apiUrl);
  }

  getAppointmentById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getAppointmentByDate(date: string) {
    return this.http.get(`${this.apiUrl}/date/${date}`);
  }

  createAppointment(appointment: AppointmentRequest) {
    return this.http.post(this.apiUrl, appointment);
  }

  updateAppointment(appointment: AppointmentRequest) {
    return this.http.patch(this.apiUrl, appointment);
  }

  deleteAppointment(id: number, deleteAllFutureAppointments: boolean) {
    return this.http.delete(`${this.apiUrl}/${id}/deleteAllFutureAppointments=${deleteAllFutureAppointments}`);
  }

  addParticipant(appointmentId: number, userId: number) {
    return this.http.post(`${this.apiUrl}/${appointmentId}/user/${userId}`, {});
  }

  removeParticipant(appointmentId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/${appointmentId}/user/${userId}`);
  }



}
