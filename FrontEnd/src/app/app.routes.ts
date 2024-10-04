import { Routes } from '@angular/router';
import { HomePageComponent } from './src/components/home-page/home-page.component';
import { LoginComponent } from './src/components/login/login.component';
import { SingupComponent } from './src/components/singup/singup.component';
import { ShifAdminScreenComponent } from './src/layout/shif-admin-screen/shif-admin-screen.component';
import { UserEditComponent } from './src/components/user-edit/user-edit.component';
import {ShifClientScreenComponent} from "./src/layout/shif-client-screen/shif-client-screen.component";

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'singup', component: SingupComponent },
    { path: 'admin/agenda', component: ShifAdminScreenComponent },
    { path: 'edit', component: UserEditComponent},
    { path: 'cliente/agenda', component: ShifClientScreenComponent },
];
