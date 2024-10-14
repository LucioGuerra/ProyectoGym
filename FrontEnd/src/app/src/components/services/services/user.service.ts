import {Injectable} from '@angular/core';
import {environment} from '../../../../../index';

import {UserModel} from '../../models';

import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

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
    return this.http.get<UserModel>(`${this.apiUrl}/${email}`);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user);
  }

  updateUser(id: string, user: UserModel): Observable<any> {
    return this.http.patch<UserModel>(`${this.apiUrl}/${id}`, user);
  }
}
