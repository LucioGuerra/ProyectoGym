import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
// @ts-ignore
import * as auth0 from 'auth0-js';

@Injectable({providedIn: "root"})
export class AuthService {
  private auth0Client: auth0.WebAuth;

  constructor() {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      redirectUri: "http://localhost:4200/home",
      responseType: 'token',
      cookieDomain: "."
    })
  }

  public login(email: string | undefined, password: string | undefined): void {
    this.auth0Client.login({
      email: email,
      password: password,
      realm: environment.auth0.database,
      audience: environment.auth0.audience
    });
  }

  public loginWithThirdParty(provider: string){
    this.auth0Client.authorize({
      connection: provider
    })
  }

  public signup(email: string | undefined, password: string | undefined): void {
    this.auth0Client.signup({
      email: email,
      password: password,
      connection: environment.auth0.database,
    }, (err: any, result: any) => {
      if (err) {
        console.error('Error al registrar:', err);
      } else {
        console.log('Usuario registrado exitosamente:', result);
      }
    });
  }

  public handleAuthentication(): void {
    const queryParams = new URLSearchParams(window.location.hash.substring(1));
    const urlParams = new URLSearchParams(queryParams);

    if(urlParams){
      try{
        const accessToken = urlParams.get("access_token");
        const expiresIn = urlParams.get("expires_in");

        this.setSession(accessToken, expiresIn);
      } catch(error){
        console.error(error);
      }
    }
  }

  private setSession(accessToken: any, expiresIn: any): void {
    console.log('User authenticated:', accessToken);
    console.log('token expire:', expiresIn);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('expires_at', expiresIn);
  }

  private logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');

    this.auth0Client.logout({
      returnTo: 'http://localhost:4200/home'
    })
  }
}
