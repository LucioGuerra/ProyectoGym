import {Injectable, signal} from "@angular/core";
import {environment} from "../../../../../environments";
// @ts-ignore
import * as auth0 from 'auth0-js';
import {UserService} from "./user.service";
import {Role, UserModel} from "../../models";
import {MatSnackBar} from '@angular/material/snack-bar';
import {DniService} from "../dni/dni.service";
import {SendEmailComponent} from "../../dialog/send-email/send-email.component";
import { jwtDecode } from "jwt-decode";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DniDialogComponent } from "../../dni-dialog/dni-dialog.component";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { ErrorDialogComponent } from "../../dialog/error-dialog/error-dialog.component";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {

  private auth0Client: auth0.WebAuth;
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  isClient = signal<boolean>(false);
  userInfo = signal<any>(null);

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private dniService: DniService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      audience: environment.auth0.audience,
      redirectUri: "http://localhost:4200/home",
      responseType: 'token id_token'
    })
    this.loadSession();
  }

  public login(email: string | undefined, password: string | undefined): void {
    this.auth0Client.login({
      email: email,
      password: password,
      realm: environment.auth0.database,
      audience: environment.auth0.audience
    }, (err: any, result: any) => {
      if (err.code == "access_denied") {
        this.dialog.open(ErrorDialogComponent, {data: {message: "Usuario o contraseña incorrectos"}});
      } else if (err) {
        this.dialog.open(ErrorDialogComponent, {data: {message: "Ha ocurrido un error, intente nuevamente"}});
      }
    });
  }

  public loginWithThirdParty(provider: string) {
    this.auth0Client.authorize({
      connection: provider
    })
  }

  public async signup(email: string | undefined, password: string | undefined, user: UserModel): Promise<void> {
    var userDniExists: boolean = true;
    try {
      const _user: UserModel = await firstValueFrom(this.userService.getUserByDNI(user.dni));
      console.log("El DNI ya existe, no se puede registrar");
      this.dialog.open(ErrorDialogComponent, {data: {message: "El DNI ya se encuentra registrado"}});
      userDniExists = true;
    } catch (error) {
      console.log("El DNI no existe, se puede registrar");
      userDniExists = false;
    }
    console.log("userDniExists: ", userDniExists);
    if (!userDniExists) {
      console.log("Entra al signup");
      this.auth0Client.signup({
        email: email,
        password: password,
        connection: environment.auth0.database,
        audience: environment.auth0.audience
      }, (err: any, result: any) => {
        if (err) {
          if (err.code == "invalid_signup") {
            this.dialog.open(ErrorDialogComponent, {data: {message: "El email ya se encuentra registrado."}});
          } else if (err.code == "invalid_password") {
            this.dialog.open(ErrorDialogComponent, {
              data: {
                message: `La contraseña no es lo suficientemente segura, revisa los siguientes puntos:\n
                * Al menos 8 caracteres de longitud\n
                * Contener al menos 3 de los siguientes 4 tipos de caracteres:\n
                * letras minúsculas (a-z)\n
                * letras mayúsculas (A-Z)\n
                * números (i.e. 0-9)\n
                * caracteres especiales (e.g. !@#$%^&*)`
              }
            });
          } else if (err) {
            console.log("Error: ", err);
            this.dialog.open(ErrorDialogComponent, {data: {message: "Ha ocurrido un error, intente nuevamente."}});
          }
        } else if (result) {
          console.log("Usuario creado correctamente, result: ", result);
          this.userService.createUser(user).subscribe(
            (saveUser: UserModel) => {
              console.log("Usuario guardado: ", saveUser);
              var s = this._snackBar.open("Se ha registrado correctamente, logueando...", "Cerrar", {
                duration: 2000,
              });
              s.afterDismissed().subscribe(() => {
                this.login(email, password);
              });
            },
            (error) => {
              console.error("Error al guardar el usuario: ", error);
            });
        }
      });
    }
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

        console.log("accessToken: ", accessToken);
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

            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.maxWidth = '1400px';
            dialogConfig.width = '40%';
            dialogConfig.panelClass = 'custom-dialog';
            dialogConfig.hasBackdrop = false;
            dialogConfig.data = {
              // @ts-ignore
              apellido: jwtDecode(idToken)['family_name'],
              // @ts-ignore
              nombre: jwtDecode(idToken)['given_name'],
            }
            // @ts-ignore
            console.log("apellido: ", jwtDecode(idToken)['family_name']);
            const dialogRef = this.dialog.open(DniDialogComponent, dialogConfig);
            await dialogRef.afterClosed().toPromise();
            let dni = this.dniService.getDni();
            if (dni) {
              console.log("DNI entered:", dni);
              usuario = {
                // @ts-ignore
                email: jwtDecode(idToken)['email'],
                // @ts-ignore
                firstName: this.dniService.getNombre(),
                // @ts-ignore
                lastName: this.dniService.getApellido(),
                dni: dni,
                // @ts-ignore
                picture: jwtDecode(idToken)['picture'],
              };
              try {
                await this.createUser(usuario);
                await this.setSession(accessToken, expiresIn, idToken, Role.CLIENT);
              } catch (error) {
                const d = this.dialog.open(ErrorDialogComponent, { data: { message: "Ha ocurrido un error, intente mas tarde." } });
                d.afterClosed().subscribe(() => {
                  this.router.navigate(['/home']);
                });
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
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

  public forgotPassword(email: string): void {
    this.auth0Client.changePassword({
      connection: environment.auth0.database,
      email: email
    }, (err: any, resp: any) => {
      if (err) {
        this.dialog.open(ErrorDialogComponent, { data: { message: "Ha ocurrido un error, intente nuevamente." } });
      } else {
        console.log("Password change email sent:", resp);
        this.dialog.open(SendEmailComponent, { data: { message: "Correo de restablecimiento de contraseña enviado." } });
      }
    });
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

      //this.isClient.set(true);
    });
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

  private async createUser(user: UserModel): Promise<void> {
    console.log("Entra a createUser");

    try {
      const saveUser: UserModel = await firstValueFrom(this.userService.createUser(user));
      console.log("Usuario guardado: ", saveUser);
    } catch (error) {
      console.error("Error al guardar el usuario: ", error);
      throw error;
    }
  }

  getToken() {
    console.log("Entra a getToken");
    console.log(localStorage.getItem('access_token'));
    return localStorage.getItem('access_token');
  }
}
