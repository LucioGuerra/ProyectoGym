import { ChangeDetectionStrategy, Component, effect, signal, inject, ChangeDetectorRef } from '@angular/core';
import { DrawerComponent } from '../drawer/drawer.component';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from "../services/services/auth.service";
import { ActivityService } from '../services/services/activity.service';
import { Router } from "@angular/router";
import { Role } from '../models';
import { Activity } from '../models';
import { User } from "@auth0/auth0-angular";
import { MatDividerModule } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import { MatActionList} from "@angular/material/list";
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MainScreenComponent } from "../../layout/main-screen/main-screen.component";



@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    DrawerComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatActionList,
    MatButton,
    MatDividerModule,
    MainScreenComponent
],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActivityListComponent {

  roles = Object.values(Role);
  user = signal<User>({});
  activities = signal<Activity[]>([]);
  dataSource = new MatTableDataSource<Activity>();

  displayedColumns: string[] = ['name', 'description', 'price', 'buttons'];


  constructor(
    private activityService: ActivityService,
    private auth0: AuthService,
    private router: Router,
    private changes: ChangeDetectorRef) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
          return
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
    this.activityService.getActivities().subscribe({
      next: (activities: any) => {
        const formattedActivities = activities.map((activity: any) => ({
          id: activity.id,
          name: activity.name,
          description: activity.description,
          price: activity.price
        }));
        this.activities.set(formattedActivities);
        this.dataSource.data = formattedActivities;
        this.changes.detectChanges();
      },
      error: (error: any) => console.error(error),
      complete: () => console.log('Request completed')
    });
  }



  addActivity(){
    this.router.navigate(['/admin/activity/create']);
  }


  updateActivity(id: string) {
    this.router.navigate(['/admin/activity/edit', id]);
  }
}
