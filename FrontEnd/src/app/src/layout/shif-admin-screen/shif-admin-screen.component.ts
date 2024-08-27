import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../components/index';

@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule ],
  templateUrl: './shif-admin-screen.component.html',
  styleUrl: './shif-admin-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShifAdminScreenComponent {

  constructor(private auth: AuthService) {}

  menu() {
    alert('menu');
  }
  logout() {
    alert('logout');
  }

}
