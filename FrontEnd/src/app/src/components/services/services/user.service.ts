import { BodyPart, KineModel } from './../../models/userModel.models';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../index';

import {Appointment, Role, UserModel} from '../../models';

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

  getStreak(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/streak/${id}`);
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
      map((appointments: Appointment[]) => appointments.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date), // Convertir la cadena "date" a un objeto Date
          max_capacity: appointment.max_capacity || 0,
          startTime: appointment.startTime.split(':').slice(0, 2).join(':') || '',
          endTime: appointment.endTime.split(':').slice(0, 2).join(':') || '',
        }))
      ));
  }

  getUserActivePackages(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/public/users/package/${id}`);
  }

  getUserHistory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/public/users/history/${id}`);
  }

  getKinesioUsers(): Observable<KineModel[]> {
    const kinesiologos: KineModel[] = [
      {
        firstName: 'Kine',
        lastName: 'Uno',
        email: 'kineUno@gmail.com',
        role: Role.KINE,
        dni: '90909090',
        picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
        bodyParts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      {
        firstName: 'Kine',
        lastName: 'Dos',
        email: 'kineDos@gmail.com',
        role: Role.KINE,
        dni: '91919191',
        picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
        bodyParts: [1, 2, 7, 8, 9, 10, 11]
      },
      {
        firstName: 'Kine',
        lastName: 'Tres',
        email: 'kineTres@gmail.com',
        role: Role.KINE,
        dni: '92929292',
        picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
        bodyParts: [1, 2, 3, 4, 5]
      },
      {
        firstName: 'Kine',
        lastName: 'Cuatro',
        email: 'kineCuatro@gmail.com',
        role: Role.KINE,
        dni: '93939393',
        picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
        bodyParts: [8, 9, 10, 11, 12]
      },
    ];
    return of(kinesiologos);
    //return this.http.get<UserModel[]>(`${this.apiUrl}/kine`);
  }

  getBodyParts(): Observable<BodyPart[]> {
    const bodyParts: BodyPart[] = [
      {
        id: 1,
        name: 'Cabeza',
      },
      {
        id: 2,
        name: 'Cuello',
      },
      {
        id: 3,
        name: 'Hombro',
      },
      {
        id: 4,
        name: 'Brazo',
      },
      {
        id: 5,
        name: 'Antebrazo',
      },
      {
        id: 6,
        name: 'Mano',
      },
      {
        id: 7,
        name: 'Espalda',
      },
      {
        id: 8,
        name: 'Cadera',
      },
      {
        id: 9,
        name: 'Pierna',
      },
      {
        id: 10,
        name: 'Rodilla',
      },
      {
        id: 11,
        name: 'Tobillo',
      },
      {
        id: 12,
        name: 'Pie',
      },
    ];
    return of(bodyParts);
    //return this.http.get<any[]>(`${this.apiUrl}/kine/body-parts`);
  }
}
