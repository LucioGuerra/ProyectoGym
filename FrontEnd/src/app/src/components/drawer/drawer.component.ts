import {Component, Inject, signal} from '@angular/core';
import { ToolbarComponent } from "../toolbar";
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerListComponent } from "./drawer-list/drawer-list.component";
import { MatIconModule } from '@angular/material/icon';
import {DOCUMENT, NgIf} from '@angular/common';
import { AuthService } from '../services/services';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [MatButtonModule, ToolbarComponent, MatSidenavModule, DrawerListComponent, MatIconModule, UserProfileComponent, NgIf],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent {

  windowWidth = signal<number>(window.innerWidth);
  isMobileScreen = signal(window.innerWidth <= 768);

  events: string[] = [];
  opened: boolean = false;

  constructor(@Inject(DOCUMENT) public document: Document, private auth0: AuthService) {
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  logout() {
    this.auth0.logout();
  }

  checkScreenSize(): void {
    this.isMobileScreen.set(window.innerWidth <= 768);
  }

  toggleSidenav(): void {
    console.log('toggleSidenav');
    if (this.isMobileScreen()) {
      console.log('mobile');
      this.opened = !this.opened;

    } else {
      console.log('desktop');
      this.opened = !this.opened;
    }
  }



}
