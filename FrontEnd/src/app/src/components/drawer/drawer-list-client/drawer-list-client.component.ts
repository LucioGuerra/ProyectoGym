import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-drawer-list-client',
  standalone: true,
  imports: [MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './drawer-list-client.component.html',
  styleUrl: './drawer-list-client.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerListClientComponent {
  appLinks = [
    {id: 1, name: 'Agenda', icon: 'calendar_today', link: '/agenda'},
  ];

  constructor(private router: Router) {
  }

}
