import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DniService {

  dni: string = '';

  constructor() { }

  setDni(dni: string) {
    this.dni = dni;
  }

  getDni() {
    return this.dni
  }
}
