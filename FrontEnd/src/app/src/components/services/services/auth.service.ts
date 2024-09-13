import { Injectable } from "@angular/core";
// @ts-ignore
import * as auth0 from 'auth0-js';
import {environment} from "../../../../../environments/environment";

@Injectable({providedIn: "root"})
export class AuthService {
  private auth0Client: auth0.WebAuth;

  constructor() {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      redirectUri: "http://localhost:4200/home",
    })
  }

  private login(email: string, password: string, realm: string): void {
    this.auth0Client.login({
      email: email,
      password: password,
      realm: realm
    });
  }

  private loginWithThirdParty(provider: string){
    this.auth0Client.authorize({
      connection: provider
    })
  }

  private signup(email: string, password: string): void {
    this.auth0Client.signup({
      email: email,
      password: password,
      connection: environment.auth0.database
    })
  }

  private handleAuthentication(): void {
    this.auth0Client.parseHash((err: any, authResult: { accessToken: any }) => {

      if (err) {
        console.error('Error parsing hash:', err);
        return;
      }
      if (authResult && authResult.accessToken) {
        this.auth0Client.setSession(authResult);
        console.log('User authenticated:', authResult);
      }
    });
  }

  private setSession(authResult: any): void {
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('expires_at', authResult.expires_at);
  }

  private logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');

    this.auth0Client.logout({
      returnTo: 'http://localhost:4200/home'
    })
  }
}
