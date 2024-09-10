import {inject, Injectable, signal} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  public  isAuthenticated = signal<boolean>(false);
  public token = signal<string | null>(null)

  async login(email: string | undefined, password: string | undefined) {
    const url = `https://${environment.auth0.domain}/oauth/token`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      grant_type: 'password',
      username: email,
      password: password,
      client_id: environment.auth0.clientId,
    };

    const response: any = await firstValueFrom(this.http.post(url, body, {headers: headers}));
    this.token.set(response.access_token);
    this.isAuthenticated.set(true);
    console.log('JWT: ', response.access_token);
  }

  logout(){
    this.token.set(null);
    this.isAuthenticated.set(false);
  }
}
