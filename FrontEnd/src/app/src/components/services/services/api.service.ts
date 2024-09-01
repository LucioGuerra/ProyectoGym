import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'apiURL'; //tenemos q ponerla, es del back
  constructor(private HttpClient: HttpClient) { }

  public postUser(): Observable<any> {
    return this.HttpClient.post(this.baseUrl + '/user', {});
  }
}
