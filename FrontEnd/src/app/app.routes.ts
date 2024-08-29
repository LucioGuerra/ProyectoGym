import { Routes } from '@angular/router';
import { HomePageComponent } from './src/components/home-page/home-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
