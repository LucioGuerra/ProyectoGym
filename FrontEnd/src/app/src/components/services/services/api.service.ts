import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@auth0/auth0-angular';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'apiURL'; //Tenemos q ponerla despues, es del back
  constructor(private HttpClient: HttpClient) { }

  public postUser(usuario: User): Observable<User> {
    return this.HttpClient.post(`${this.baseUrl}/user`, usuario);
  }
}
