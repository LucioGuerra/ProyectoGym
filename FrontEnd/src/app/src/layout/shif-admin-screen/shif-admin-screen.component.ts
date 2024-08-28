import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../components/index';
import { DOCUMENT } from '@angular/common';
import { DrawerComponent } from "../../components/drawer/drawer.component";

@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, DrawerComponent],
  templateUrl: './shif-admin-screen.component.html',
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent implements OnInit {

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

}
