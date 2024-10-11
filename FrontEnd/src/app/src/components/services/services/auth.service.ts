import {Injectable, signal} from "@angular/core";
import { environment } from "../../../../../environments/environment";
// @ts-ignore
import * as auth0 from 'auth0-js';
import { jwtDecode } from "jwt-decode";
import {BehaviorSubject} from "rxjs";
@Injectable({ providedIn: "root" })
export class AuthService {
  private auth0Client: auth0.WebAuth;
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  userInfo = signal<any>(null);

  constructor() {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      redirectUri: "http://localhost:4200/home",
      responseType: 'token id_token',
      cookieDomain: "."
    })
    this.loadSession();
  }

  public login(email: string | undefined, password: string | undefined): void {
    this.auth0Client.login({
      email: email,
      password: password,
      realm: environment.auth0.database,
      audience: environment.auth0.audience
    });
  }
  public loginWithThirdParty(provider: string) {
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
    if (urlParams.get("access_token")) {
      try {
        const accessToken = urlParams.get("access_token");
        const expiresIn = urlParams.get("expires_in");
        const idToken = urlParams.get("id_token");
        console.log("accessToken: ", accessToken, "expiresIn: ", expiresIn, "idToken: ", idToken);
        this.setSession(accessToken, expiresIn, idToken);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private setSession(accessToken: any, expiresIn: any, idToken: any): void {
    const expiresAt = (Date.now() + parseInt(expiresIn) * 1000).toString();
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('idToken', idToken);

    this.isAuthenticated.set(true);
    this.setRole(idToken);
    this.setUserInfo(idToken);
  }

  public logout(): void {
    console.log("Entra al logout")
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('idToken');
    this.isAuthenticated.set(false);
    console.log("me Deslogea");
    this.isAdmin.set(false);
    this.auth0Client.logout({
      returnTo: 'http://localhost:4200/home'
    })
  }
  private setRole(idToken: any) {
    // @ts-ignore
    const role = jwtDecode(idToken)['https://criminal-cross.com/roles'];
    if (role) {
      if (role == 'ADMIN') {
        this.isAdmin.set(true);
        console.log("Es admin");
      } else {
        this.isAdmin.set(false);
        console.log("No es admin");
      }
    } else {
      console.error("No hay ningun rol asignado")
    }
  }

  public setUserInfo(idToken: any) {
    console.log("Entra a setUserInfo: ", jwtDecode(idToken));
    this.userInfo.set(jwtDecode(idToken));
  }

  private loadSession() {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    const idToken = localStorage.getItem('idToken');

    if (accessToken && expiresAt && idToken) {
      const expiresAtDate = new Date(parseInt(expiresAt!));
      const currentDate = new Date();

      if (currentDate < expiresAtDate) {
        this.isAuthenticated.set(true);
        this.setRole(idToken);
        this.setUserInfo(idToken);
        console.log('Sesión restaurada con éxito.');
      } else {
        console.log('La sesión ha expirado, deslogueando...');
        this.logout();
      }
    } else {
      console.log('No hay sesión activa almacenada.');
      console.log('Deslogueando...');
    }
  }
}
