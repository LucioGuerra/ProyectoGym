import {Injectable, signal} from "@angular/core";
import {environment} from "../../../../../environments/environment";
// @ts-ignore
import * as auth0 from 'auth0-js';
import {jwtDecode} from "jwt-decode";
import {UserService} from "./user.service";
import {Role, UserModel} from "../../models";
import {MatDialog} from '@angular/material/dialog';
import {DniDialogComponent} from "../../dni-dialog/dni-dialog.component";
import {HttpClient} from "@angular/common/http";


@Injectable({ providedIn: "root" })
export class AuthService {
  private auth0Client: auth0.WebAuth;
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  isClient = signal<boolean>(false);
  userInfo = signal<any>(null);

  constructor(private userService: UserService, private dialog: MatDialog, private http: HttpClient) {
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

  public signup(email: string | undefined, password: string | undefined, user: UserModel): void {
    this.auth0Client.signup({
      email: email,
      password: password,
      connection: environment.auth0.database,
      audience: environment.auth0.audience
    }, (err: any, result: any) => {
      if (err) {
        console.error('Error al registrar:', err);
      } else {
        this.createUser(user);
        this.login(email, password);
      }
    });
  }

  public async handleAuthentication(): Promise<void> {
    const queryParams = new URLSearchParams(window.location.hash.substring(1));
    const urlParams = new URLSearchParams(queryParams);
    var usuario: UserModel;

    console.log("Entra a handleauth");

    if (urlParams.get("access_token")) {
      try {
        const accessToken = urlParams.get("access_token");
        const expiresIn = urlParams.get("expires_in");
        const idToken = urlParams.get("id_token");

        console.log("entramos a handleauth ");
        // @ts-ignore
        this.userService.getUserByEmail(jwtDecode(idToken)['email']).subscribe(
          async (user: UserModel) => {
            console.log("Usuario encontrado: ", user);
            if (user.picture == null) {
              // @ts-ignore
              this.userService.setPictureToUser(jwtDecode(idToken)['picture'], jwtDecode(idToken)['email']);
            }
            await this.setSession(accessToken, expiresIn, idToken, user.role!);
          },
          async (error) => {
            console.log("El usuario no existe, se crea uno...");

            const dialogRef = this.dialog.open(DniDialogComponent);

            const dni = await dialogRef.afterClosed().toPromise();
            if (dni) {
              console.log("DNI entered:", dni);
              usuario = {
                // @ts-ignore
                email: jwtDecode(idToken)['email'],
                // @ts-ignore
                firstName: jwtDecode(idToken)['given_name'],
                // @ts-ignore
                lastName: jwtDecode(idToken)['family_name'],
                dni: dni,
                // @ts-ignore
                picture: jwtDecode(idToken)['picture'],
                // @ts-ignore
                role: jwtDecode(idToken)['https://criminal-cross.com/roles'],
              };
              this.createUser(usuario);
              // Use the DNI as needed
            }
            await this.setSession(accessToken, expiresIn, idToken, Role.CLIENT);
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  private setSession(accessToken: any, expiresIn: any, idToken: any, userRole: Role): Promise<void> {
    return new Promise(async (resolve) => {
      const expiresAt = (Date.now() + parseInt(expiresIn) * 1000).toString();
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('expires_at', expiresAt);
      localStorage.setItem('idToken', idToken);

      this.isAuthenticated.set(true);
      this.setRole(userRole);
      this.setUserInfo(idToken);

      this.isClient.set(true);
    });
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

  private setRole(userRole: Role) {
    // @ts-ignore
    if (userRole) {
      if (userRole == Role.ADMIN) {
        this.isAdmin.set(true);
        this.isClient.set(false);
        console.log("Es admin");
      } else if (userRole == Role.CLIENT) {
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
        // @ts-ignore
        this.userService.getUserByEmail(jwtDecode(idToken)['email']).subscribe(
          (user: UserModel) => {
            console.log("Usuario encontrado: ", user);
            this.setRole(user.role!);
          },
          (error) => {
            console.error("Error al buscar el usuario: ", error);
          });
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

  private createUser(user: UserModel) {
    console.log("Entra a createUser");

    // @ts-ignore
    this.userService.getUserByEmail(user.email).subscribe(
      (user: UserModel) => {
        console.log("Usuario encontrado: ", user);
      },
      (error) => {
        console.error("Error al buscar el usuario: ", error);
      });

    this.userService.createUser(user).subscribe(
      (saveUser: UserModel) => {
        console.log("Usuario guardado: ", saveUser);
      },
      (error) => {
        console.error("Error al guardar el usuario: ", error);
      });
  }
}
