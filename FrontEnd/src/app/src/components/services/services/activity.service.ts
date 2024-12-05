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
    return this.http.get<Activity[]>(`${this.apiUrl}/public`);
  }

  createActivity(activity: Activity) {
    // const header = {
    //   Authorization: `Bearer ${localStorage.getItem('access_token')}`
    // }
    // console.log(header);
    return this.http.post(this.apiUrl + "/admin", activity);
  }

  getActivitybyId(activityId: string) {
    return this.http.get<Activity>(`${this.apiUrl+"/admin"}/${activityId}`);
  }

  editActivity(activityId: string, activity: Activity) {
    return this.http.patch(`${this.apiUrl+"/admin"}/${activityId}`, activity);
  }

  updateActivity(id: bigint, updatedActivity: Activity): Observable<Activity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Activity>(url, updatedActivity);
  }
  

}
