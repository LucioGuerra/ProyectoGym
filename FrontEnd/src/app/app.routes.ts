import {Routes} from '@angular/router';
import {HomePageComponent} from './src/components/home-page/home-page.component';
import {LoginComponent} from './src/components/login/login.component';
import {ShifAdminScreenComponent} from './src/layout/shif-admin-screen/shif-admin-screen.component';
import {UserEditComponent} from './src/components/user-edit/user-edit.component';
import {UsersListComponent} from './src/components/users-list/users-list.component';
import {CreateAppointmentComponent} from "./src/layout/create-appointment/create-appointment.component";
import {ClientAgendaComponent} from "./src/layout/client-agenda/client-agenda.component";
import {UserInfoComponent} from "./src/components/user-info/user-info.component";
import {SignupComponent} from "./src/components/signup/signup.component";
import {CreatPackageFormComponent} from "./src/components/creat-package-form/creat-package-form.component";
import {CreateActivityComponent} from "./src/components/create-activity/create-activity.component";
import {EcommerceComponent} from "./src/components/ecommerce/ecommerce.component";
import {ShoppingCartComponent} from "./src/components/shopping-cart/shopping-cart.component";
import {AnnouncementsComponent} from "./src/components/announcements/announcements.component";
import {AnnouncementCreationComponent} from "./src/components/announcenmentCreation/announcementCreation.component";
import { ActivityListComponent } from './src/components/activity-list/activity-list.component';
import {ForgotPasswordComponent} from "./src/components/forgot-password/forgot-password.component";

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'admin/agenda', component: ShifAdminScreenComponent},
  {path: 'edit/:id', component: UserEditComponent},
  {path: 'edit', component: UserEditComponent},
  {path: 'admin/users', component: UsersListComponent},
  {path: 'admin/appointment/create', component: CreateAppointmentComponent},
  {path: 'admin/appointment/edit/:id', component: CreateAppointmentComponent},
  {path: 'agenda', component: ClientAgendaComponent},
  {path: 'user-info', component: UserInfoComponent},
  {path: 'package/create', component: CreatPackageFormComponent},
  {path: 'admin/activities', component: ActivityListComponent},
  {path: 'admin/activity/create', component: CreateActivityComponent},
  {path: 'admin/activity/edit/:id', component: CreateActivityComponent},
  {path: 'admin/ecommerce', component: EcommerceComponent},
  {path: 'ecommerce/shopping_cart', component: ShoppingCartComponent},
  {path: 'admin/announcements', component: AnnouncementsComponent},
  {path: 'admin/announcements/create', component: AnnouncementCreationComponent},
  {path: 'admin/announcements/edit/:id', component: AnnouncementCreationComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},
];
