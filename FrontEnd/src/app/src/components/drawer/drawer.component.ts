import { Component, Inject, OnInit } from '@angular/core';
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerListComponent } from "./drawer-list/drawer-list.component";
import { MatIconModule } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [MatButtonModule, ToolbarComponent, MatSidenavModule, DrawerListComponent, MatIconModule, UserProfileComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent implements OnInit {
  
  events: string[] = [];
  opened: boolean = true;
  

  constructor(@Inject(DOCUMENT) public document: Document, private auth: AuthService) {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('isAuthenticated:', isAuthenticated);
      if(!isAuthenticated) {
        this.auth.loginWithRedirect();
      }else{
        this.auth.user$.subscribe(user => {
          console.log('User:', user);
        });
      }
    });
  }
  ngOnInit(): void {
    
  }

  menu() {
    alert('menu');
  }
  logout() {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('user is authenticated: ' + isAuthenticated);
      
      if (isAuthenticated && confirm('Are you sure you want to logout?')) {
        this.auth.logout({ logoutParams: { returnTo: document.location.origin } });
      }
    });
  }
}
