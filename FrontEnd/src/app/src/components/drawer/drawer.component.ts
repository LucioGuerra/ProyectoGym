import {Component, Inject, signal} from '@angular/core';
import { ToolbarComponent } from "../toolbar";
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerListComponent } from "./drawer-list/drawer-list.component";
import { MatIconModule } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../services/services';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [MatButtonModule, ToolbarComponent, MatSidenavModule, DrawerListComponent, MatIconModule, UserProfileComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent {

  anchoPantalla = signal<number>(window.innerWidth);
  esMovil = signal<boolean>(window.innerWidth <= 768);

  events: string[] = [];
  opened: boolean = true;

  constructor(@Inject(DOCUMENT) public document: Document, private auth0: AuthService) {
    window.addEventListener('resize', this.actualizarAnchoPantalla.bind(this));
  }

  menu() {
    alert('menu');
  }

  logout() {
    this.auth0.logout();
  }

  actualizarAnchoPantalla(): void {
    const nuevoAncho = window.innerWidth;
    this.anchoPantalla.set(nuevoAncho);
    this.esMovil.set(nuevoAncho <= 768); // Si el ancho es menor o igual a 768px, lo consideramos móvil
  }


  protected readonly resizeTo = resizeTo;
}
