import { ChangeDetectionStrategy, Component, Inject, model, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../components/index';
import { DOCUMENT } from '@angular/common';
import { DrawerComponent } from "../../components/drawer/drawer.component";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, DrawerComponent],
  templateUrl: './shif-admin-screen.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent implements OnInit {
  events = signal<string[]>([]);

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.update(events => [...events, `${type}: ${event.value}`]);
  }


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
