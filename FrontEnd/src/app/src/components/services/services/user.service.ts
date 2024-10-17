import {Injectable} from '@angular/core';
import {environment} from '../../../../../index';

import {Appointment, UserModel} from '../../models';

import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  getUserById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

      getUserByEmail(email: string): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUrl}/email`, {params: {email: email}});
      }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  createUser(user: UserModel): Observable<UserModel> {
        console.log("Entra al create user")
        return this.http.post<UserModel>(this.apiUrl, user);
      }

      updateUser(user: UserModel): Observable<any> {
        return this.http.patch<UserModel>(`${this.apiUrl}/${user.id}`, user);
      }

  setPictureToUser(picture: any, email: string) {
    let user = this.getUserByEmail(email);
    user.subscribe((user) => {
      user.picture = picture;
      this.updateUser(user).subscribe();
    });
  }

  getUserAppointments(id: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/public/users/appointments/${id}`).pipe(
      map((appointments: Appointment[]) => appointments.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
          max_capacity: appointment.max_capacity || 0,
          startTime: appointment.startTime.split(':').slice(0, 2).join(':') || '',
          endTime: appointment.endTime.split(':').slice(0, 2).join(':') || '',
        }))
      )    );
  }

  getUserPackages(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/public/users/package/${id}`);
  }
}
