import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DniService {

  dni: string = '';
  apellido: string = '';
  nombre: string = '';

  constructor() { }

  setDni(dni: string) {
    this.dni = dni;
  }

  getDni() {
    return this.dni
  }

  setApellido(apellido: string) {
    this.apellido = apellido;
  }

  getApellido() {
    return this.apellido;
  }

  setNombre(nombre: string) {
    this.nombre = nombre;
  }

  getNombre() {
    return this.nombre;
  }
}
