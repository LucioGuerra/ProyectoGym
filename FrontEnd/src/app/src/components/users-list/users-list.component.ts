import { ChangeDetectionStrategy, Component } from '@angular/core';

import {DrawerComponent} from "../drawer/drawer.component";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatActionList} from "@angular/material/list";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

const USERS: User[] = [
  { id: 1, firstname: 'John', lastname: 'Doe', email: 'JohnDoe@gmail.com' },
  { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'JaneSmith@gmail.com' },
  { id: 3, firstname: 'Michael', lastname: 'Johnson', email: 'MichaelJohnson@gmail.com' },
  { id: 4, firstname: 'Emily', lastname: 'Davis', email: 'EmilyDavis@gmail.com' },
  { id: 5, firstname: 'Chris', lastname: 'Brown', email: 'ChrisBrown@gmail.com' },
  { id: 6, firstname: 'Sarah', lastname: 'Wilson', email: 'SarahWilson@gmail.com' },
  { id: 7, firstname: 'David', lastname: 'Martinez', email: 'DavidMartinez@gmail.com' },
  { id: 8, firstname: 'Sophia', lastname: 'Anderson', email: 'SophiaAnderson@gmail.com' },
  { id: 9, firstname: 'James', lastname: 'Taylor', email: 'JamesTaylor@gmail.com' },
  { id: 10, firstname: 'Olivia', lastname: 'Thomas', email: 'OliviaThomas@gmail.com' },
  { id: 11, firstname: 'Daniel', lastname: 'Moore', email: 'DanielMoore@gmail.com' },
  { id: 12, firstname: 'Mia', lastname: 'Jackson', email: 'MiaJackson@gmail.com' },
  { id: 13, firstname: 'Robert', lastname: 'White', email: 'RobertWhite@gmail.com' },
  { id: 14, firstname: 'Ava', lastname: 'Harris', email: 'AvaHarris@gmail.com' },
  { id: 15, firstname: 'Alexander', lastname: 'Lewis', email: 'AlexanderLewis@gmail.com' }
];

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    DrawerComponent,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatActionList
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = USERS;
  protected readonly USERS = USERS;

  deleteUser(id: bigint){
  }

  updateUser(id: bigint){
  }

}
