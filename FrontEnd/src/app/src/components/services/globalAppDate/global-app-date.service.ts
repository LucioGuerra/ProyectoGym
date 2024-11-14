import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalAppDateService {
  date: Date = new Date(new Date(Date.now()).setHours(0, 0, 0, 0));
  constructor() { }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date;
  }
}
