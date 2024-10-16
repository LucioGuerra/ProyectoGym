import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerComponent } from '../drawer/drawer.component';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    DrawerComponent, 
    MatCard,
    MatCardHeader,
    MatIcon        
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityListComponent {

}
