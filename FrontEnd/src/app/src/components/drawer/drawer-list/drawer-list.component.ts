import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-drawer-list',
  standalone: true,
  imports: [MatListModule, MatDividerModule],
  templateUrl: './drawer-list.component.html',
  styleUrl: './drawer-list.component.scss'
})
export class DrawerListComponent {
  appLinks = [
    { id: 1, name: 'Agenda' },
    { id: 2, name: 'Users' },
    { id: 3, name: 'Sales' },
    { id: 4, name: 'Ecomerce' },
    { id: 5, name: 'Routines' },
  ];
}
