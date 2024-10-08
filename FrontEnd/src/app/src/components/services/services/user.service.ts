import { Injectable } from '@angular/core';
import { User } from '../../models';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
    private apiUrl = 'http://localhost:8080/api/users';
      getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
      }

      getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
      }

      createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
      }

      updateUser(user: User): Observable<any> {
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
      }
}
