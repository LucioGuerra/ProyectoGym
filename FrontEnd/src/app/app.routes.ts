import { Routes } from '@angular/router';
import { HomePageComponent } from './src/components/home-page/home-page.component';
import { LoginComponent } from './src/components/login/login.component';
import { SingupComponent } from './src/components/singup/singup.component';
import { ShifAdminScreenComponent } from './src/layout/shif-admin-screen/shif-admin-screen.component';
import { UserEditComponent } from './src/components/user-edit/user-edit.component';
import { UsersListComponent } from './src/components/users-list/users-list.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SingupComponent },
    { path: 'admin/agenda', component: ShifAdminScreenComponent },
    { path: 'edit/:id', component: UserEditComponent },
    { path: 'admin/users', component: UsersListComponent },
];
