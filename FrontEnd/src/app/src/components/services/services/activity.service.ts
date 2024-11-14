import {environment} from '../../../../../index';
import {Injectable} from '@angular/core';
import {Activity} from '../../index';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  createActivity(activity: Activity) {
    return this.http.post(this.apiUrl, activity);
  }

  getActivitybyId(activityId: string) {
    return this.http.get<Activity>(`${this.apiUrl}/${activityId}`);
  }

  editActivity(activityId: string, activity: Activity) {
    return this.http.patch(`${this.apiUrl}/${activityId}`, activity);
  }
}
