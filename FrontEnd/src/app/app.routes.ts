import { Routes } from '@angular/router';
import { HomePageComponent } from './src/components/home-page/home-page.component';
import { LoginComponent } from './src/components/login/login.component';
import { SingUpComponent } from './src/components/sing-up/sing-up.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sing-up', component: SingUpComponent }
];
