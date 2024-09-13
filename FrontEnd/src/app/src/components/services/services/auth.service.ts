import { Injectable } from "@angular/core";
import {environment} from "../../../../../environments/environment";
// @ts-ignore
import * as auth0 from 'auth0-js';

@Injectable({providedIn: "root"})
export class AuthService {
  private auth0Client: auth0.WebAuth;
  //public isAuthenticated: signal<>;

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
      realm: environment.auth0.database
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

  public async handleAuthentication(): Promise<void> {
    try {
      const authResult = await this.parseHashPromise({ hash: window.location.hash });

      if (authResult && authResult.accessToken) {
        console.log('Authentication successfully');
        this.auth0Client.setSession(authResult);
        console.log('User authenticated:', authResult);
      }
    } catch (err) {
      console.error('Error parsing hash:', err);
    }
  }

    /*this.auth0Client.parseHash({ hash: window.location.hash }, function (err, authResult){
    if (err) {
      console.error('Error parsing hash:', err);
      return;
    }
    if (authResult && authResult.accessToken) {
      console.log('Authentication successfully');
      this.auth0Client.setSession(authResult);
      console.log('User authenticated:', authResult);
    }
    });


  }*/

  private setSession(authResult: any): void {
    console.log('User authenticated:', authResult.accessToken);
    console.log('token expire:', authResult.expires_at);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', authResult.expires_at);
  }

  private logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');

    this.auth0Client.logout({
      returnTo: 'http://localhost:4200/home'
    })
  }

  private parseHashPromise(options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this.auth0Client.parseHash(options, (err: any, authResult: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(authResult);
      }
    });
  });
}

}
