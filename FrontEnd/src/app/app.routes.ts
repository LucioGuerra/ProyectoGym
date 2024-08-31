import { Routes } from '@angular/router';
import { HomePageComponent } from './src/components/home-page/home-page.component';
import { ShifAdminScreenComponent } from './src/layout/shif-admin-screen/shif-admin-screen.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'admin/agenda', component: ShifAdminScreenComponent },
];
