import {Injectable, signal} from "@angular/core";
import {environment} from "../../../../../environments/environment";
// @ts-ignore
import * as auth0 from 'auth0-js';
import {jwtDecode} from "jwt-decode";
import {UserService} from "./user.service";
import {User} from "@auth0/auth0-angular";
import {Role, UserModel} from "../../models";

@Injectable({ providedIn: "root" })
export class AuthService {
  private auth0Client: auth0.WebAuth;
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  isClient = signal<boolean>(false);
  userInfo = signal<any>(null);
  userRegistration: UserModel = {
    dni: "",
    email: "",
    firstName: "",
    lastName: "",
    picture: new URL('https://cdn.pixabay.com/photo'),
  };

  constructor(private userService: UserService) {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      redirectUri: "http://localhost:4200/home",
      responseType: 'token id_token',
      cookieDomain: "."
    })
    /*this.loadSession();*/
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

  public signup(email: string | undefined, password: string | undefined, user: UserModel): void {
    console.log("Entra a signup, ", user);
    this.auth0Client.signup({
      email: email,
      password: password,
      connection: environment.auth0.database,
    }, (err: any, result: any) => {
      if (err) {
        console.error('Error al registrar:', err);
      } else {
        console.log('Usuario registrado exitosamente:', result);
        this.userRegistration.email = email!;
        this.userRegistration.firstName = user.firstName;
        this.userRegistration.lastName = user.lastName!;
        this.userRegistration.dni = user.dni;
        console.log("userRegistration: ", this.userRegistration);
        this.createUser(email);
        //this.userService.createUser(user).subscribe(
        // (saveUser: UserModel) => {
        // console.log("Usuario guardado: ", saveUser);
        this.login(email, password);
        //},
        //(error) => {
        //console.error("Error al guardar el usuario: ", error);
        //}
        //);
      }
    });
  }

  public handleAuthentication(): void {
    const queryParams = new URLSearchParams(window.location.hash.substring(1));
    const urlParams = new URLSearchParams(queryParams);
    console.log("entrando a handleAuthentication");
    if (urlParams.get("access_token")) {
      try {
        const accessToken = urlParams.get("access_token");
        const expiresIn = urlParams.get("expires_in");
        const idToken = urlParams.get("id_token");
        console.log("accessToken: ", accessToken, "expiresIn: ", expiresIn, "idToken: ", idToken);
        // @ts-ignore
        this.userService.editUser(jwtDecode(idToken)['picture'], jwtDecode(idToken)['email']);
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
        this.isClient.set(false);
        console.log("Es admin");
      } else if (role == 'CLIENT') {
        this.isAdmin.set(false);
        this.isClient.set(true);
        console.log("No es admin, es cliente?", this.isClient());
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

  private createUser(email: any) {
    let usermodel: UserModel = {
      dni: "",
      email: "",
      firstName: "",
      lastName: "",
      picture: new URL("http://localhost:4200"),
    };
    console.log("userRegistration: ", this.userRegistration);

    // @ts-ignore
    this.userService.getUserByEmail(email).subscribe(
      (user: UserModel) => {usermodel = user},
      (error) => { console.error("Error al obtener el usuario por email: ", error); }
    );
    console.log("usermodel: ", usermodel);
    if (usermodel.dni != "") {
      console.log("El usuario ya existe");
      return;
    }
    console.log("Entra a createUser");
    this.userService.createUser(this.userRegistration).subscribe(
      (saveUser: UserModel) => {
        console.log("Usuario guardado: ", saveUser);
      },
      (error) => {
        console.error("Error al guardar el usuario: ", error);
      });
  }
}
