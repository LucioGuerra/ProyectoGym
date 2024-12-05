import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal} from '@angular/core';

import {DrawerComponent} from "../drawer/drawer.component";
import {Role, UserModel} from '../models';
import {UserService} from "../services/services/user.service";
import {Router} from "@angular/router";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatActionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AuthService} from "../services/services/auth.service";
import {User} from "@auth0/auth0-angular";
import { MainScreenComponent } from "../../layout/main-screen/main-screen.component";

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
    MatMenuTrigger,
    MainScreenComponent
],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
  roles = Object.values(Role);
  user = signal<User>({});
  users: UserModel[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'buttons'];

  constructor(
    private userService: UserService,
    private auth0: AuthService,
    private router: Router,
    private changes: ChangeDetectorRef) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
        } else if (this.auth0.isClient()) {
          this.router.navigate(['/agenda']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    console.log('is admin? ', this.auth0.isAdmin(), 'is client? ', this.auth0.isClient());
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
        this.changes.detectChanges();
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
