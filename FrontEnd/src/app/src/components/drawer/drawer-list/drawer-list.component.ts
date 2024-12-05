import {Component} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-drawer-list',
  standalone: true,
  imports: [MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './drawer-list.component.html',
  styleUrl: './drawer-list.component.scss'
})
export class DrawerListComponent {
  appLinks = [
    {id: 1, name: 'Agenda', icon: 'calendar_today', link: '/admin/agenda'},
    {id: 2, name: 'Usuarios', icon: 'people', link: '/admin/users'},
    {id: 3, name: 'Actividades', icon: 'Activity', link: '/admin/activities'},
    {id: 4, name: 'Anuncios', icon: 'announcement', link: '/admin/announcements'},
    {id: 5, name: 'Compras', icon: 'shopping_cart', link: '/admin/ecommerce'},
  ];

  constructor(private router: Router) {
  }
}


