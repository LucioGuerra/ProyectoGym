import { Injectable } from '@angular/core';
import { UserModel } from '../../models';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {User} from "@auth0/auth0-angular";

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
        return this.http.get<UserModel>(`${this.apiUrl}/email`, {params: {email: email}});
      }

      getAllUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.apiUrl);
      }

  createUser(user: UserModel): Observable<UserModel> {
        console.log("Entra al create user")
        return this.http.post<UserModel>(this.apiUrl, user);
      }

      updateUser(user: UserModel): Observable<any> {
        return this.http.patch<UserModel>(`${this.apiUrl}/${user.id}`, user);
      }

  setPictureToUser(picture: any, email: string) {
    let user = this.getUserByEmail(email);
    user.subscribe((user) => {
      user.picture = picture;
      this.updateUser(user).subscribe();
    });
  }
}
