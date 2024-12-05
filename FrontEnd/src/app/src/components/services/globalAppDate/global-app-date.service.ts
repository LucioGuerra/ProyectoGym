import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalAppDateService {
  private date = signal(new Date(new Date().setHours(0, 0, 0, 0)));

  getDate() {
    return this.date(); // Accede al valor actual de la señal
  }

  setDate(date: Date): void {
    this.date.set(date); // Actualiza el valor de la señal
  }

  dateSignal() {
    return this.date.asReadonly(); // Retorna la señal para el consumo
  }
}
