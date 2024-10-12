import { Injectable } from '@angular/core';
import { UserModel } from '../../models';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
    private apiUrl = 'http://localhost:8080/api/public/users';
      getUserById(id: number): Observable<UserModel> {
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

      updateUser(user: UserModel): Observable<any> {
        return this.http.put<UserModel>(`${this.apiUrl}/${user.id}`, user);
      }
}
