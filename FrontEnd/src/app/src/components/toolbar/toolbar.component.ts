import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router'; // Import the Router class
import { routes } from '../../../app.routes';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbar],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  constructor(private router: Router) {} // Declare the router property

  inicio(){
    this.router.navigate(['/home']);
  }
}
