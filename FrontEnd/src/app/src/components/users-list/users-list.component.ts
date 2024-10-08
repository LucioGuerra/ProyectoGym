import { ChangeDetectionStrategy, Component } from '@angular/core';

import {DrawerComponent} from "../drawer/drawer.component";
import { User } from '../models';
import {UserService} from "../services/services/user.service";
import {Router} from "@angular/router";
import { Role } from '../models';

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatActionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
export interface ProvisionalUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

// Esto se reemplaza despues, cuando este funcionando el endpoint de usuarios
const provisionalUsers: ProvisionalUser[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'JohnDoe@gmail.com' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'JaneSmith@gmail.com' },
  { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'MichaelJohnson@gmail.com' },
  { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'EmilyDavis@gmail.com' },
  { id: 5, firstName: 'Chris', lastName: 'Brown', email: 'ChrisBrown@gmail.com' },
  { id: 6, firstName: 'Sarah', lastName: 'Wilson', email: 'SarahWilson@gmail.com' },
  { id: 7, firstName: 'David', lastName: 'Martinez', email: 'DavidMartinez@gmail.com' },
  { id: 8, firstName: 'Sophia', lastName: 'Anderson', email: 'SophiaAnderson@gmail.com' },
  { id: 9, firstName: 'James', lastName: 'Taylor', email: 'JamesTaylor@gmail.com' },
  { id: 10, firstName: 'Olivia', lastName: 'Thomas', email: 'OliviaThomas@gmail.com' },
  { id: 11, firstName: 'Daniel', lastName: 'Moore', email: 'DanielMoore@gmail.com' },
  { id: 12, firstName: 'Mia', lastName: 'Jackson', email: 'MiaJackson@gmail.com' },
  { id: 13, firstName: 'Robert', lastName: 'White', email: 'RobertWhite@gmail.com' },
  { id: 14, firstName: 'Ava', lastName: 'Harris', email: 'AvaHarris@gmail.com' },
  { id: 15, firstName: 'Alexander', lastName: 'Lewis', email: 'AlexanderLewis@gmail.com' }
];

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    DrawerComponent,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatActionList,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
  users: User[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'buttons'];
  dataSource = provisionalUsers;
  protected readonly USERS = provisionalUsers;

  constructor(
      // private userService: UserService,
      private router: Router) { }

  ngOnInit() {
    // this.userService.getAllUsers().subscribe({
    //   next: (users: any) => {
    //     this.users = users.map((users: any) => ({
    //         id: users.id,
    //         firstName: users.firstName,
    //         lastName: users.lastName,
    //         email: users.email
    //     }));
    //   },
    //   error: (error: any) => {
    //     console.error(error);
    //   },
    //   complete: () => {
    //     console.log('Request completed');
    //   }
    // });
  }

  // Falta implementar el soft-delete del user en el BackEnd

  // deleteUser(id: bigint) {
  //   this.userService.deleteUser(id).subscribe(() => {
  //     this.users = this.users.filter(
  //         (user: any) => user.id !== id
  //     );
  //   });
  // }

  updateUser(id: bigint) {
    this.router.navigate(['/edit', id]);
  }
}
