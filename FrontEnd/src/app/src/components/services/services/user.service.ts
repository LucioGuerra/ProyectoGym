import {BodyPart, KineModel} from './../../models/userModel.models';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../index';

import {Appointment, Instructor, Role, UserModel} from '../../models';

import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  getStreak(id: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/streak/${id}`);
  }

  getUserById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/email`, {params: {email: email}});
  }

  getUserByDNI(dni: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/dni/${dni}`);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  createUser(user: UserModel): Observable<UserModel> {
    console.log("Entra al create user")
    return this.http.post<UserModel>(this.apiUrl, user);
  }

  updateUser(user: UserModel): Observable<any> {
    console.log('Entra al update user');
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
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/${id}`).pipe(
      map((appointments: Appointment[]) =>
        appointments.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date),
          max_capacity: appointment.max_capacity || 0,
          startTime: appointment.startTime.split(':').slice(0, 2).join(':') || '',
          endTime: appointment.endTime.split(':').slice(0, 2).join(':') || '',
        })).sort((a, b) => b.date.getTime() - a.date.getTime())
      ))
  }

  getUserActivePackages(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/package/${id}`);
  }

  getUserHistory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${id}`);
  }

  getAdmins(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.apiUrl}/admins`);
  }

  getUserPackageActivities(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/package/activity/${email}`);
  }
}
