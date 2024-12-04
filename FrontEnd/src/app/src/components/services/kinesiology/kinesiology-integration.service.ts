import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BodyPart, KineModel } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class KinesiologyIntegrationService {
  
    constructor() { }

    getKinesioUsers(): Observable<KineModel[]> {
      const kinesiologos: KineModel[] = [
        {
          firstName: 'Kine',
          lastName: 'Uno',
          email: 'kineUno@gmail.com',
          dni: '90909090',
          picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
          bodyParts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        {
          firstName: 'Kine',
          lastName: 'Dos',
          email: 'kineDos@gmail.com',
          dni: '91919191',
          picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
          bodyParts: [1, 2, 7, 8, 9, 10, 11]
        },
        {
          firstName: 'Kine',
          lastName: 'Tres',
          email: 'kineTres@gmail.com',
          dni: '92929292',
          picture: new URL('https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'),
          bodyParts: [1, 2, 3, 4, 5]
        },
        {
          firstName: 'Kine',
          lastName: 'Cuatro',
          email: 'kineCuatro@gmail.com',
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
