import {ChangeDetectionStrategy, Component, effect} from '@angular/core';

import {DrawerComponent} from "../drawer/drawer.component";
import { User } from '../models';
import {UserService} from "../services/services/user.service";
import {Router} from "@angular/router";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatActionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AuthService} from "../services/services/auth.service";

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

  constructor(
      private userService: UserService,
      // private auth0: AuthService
      private router: Router,) {
    // effect(() => {
    //   if(this.auth0.isAuthenticated()){
    //     if(this.auth0.isAdmin()){
    //     }
    //     //todo redirect to client page
    //   }
    //   else{
    //     this.router.navigate(['/login']);
    //   }
    // });
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.users = users.map((users: any) => ({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email
        }));
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  updateUser(id: bigint) {
    this.router.navigate(['/edit', id]);
  }
}
