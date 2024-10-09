import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity } from '../../index'; // Ajusta según tus rutas
import { Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../index';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor( private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}/activities`;

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }
}
