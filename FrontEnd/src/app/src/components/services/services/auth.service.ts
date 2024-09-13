import { Injectable } from "@angular/core";
import * as auth0 from 'auth0-js';
import {environment} from "../../../../../environments/environment";

@Injectable({providedIn: "root"})
export class AuthService {
  private auth0Client: auth0.WebAuth;
  private authResult: any;

  constructor() {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      redirectUri: "http://localhost:4200/home",
    })
  }

  //Este manejador esta para corroborar que el jwt sea correcto, pero no se si va a ser necesario
  public handleAuthentication(): void {
    // Manejo de la autenticación después de la redirección
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

  private setSession(authResult): void {

  }
}
