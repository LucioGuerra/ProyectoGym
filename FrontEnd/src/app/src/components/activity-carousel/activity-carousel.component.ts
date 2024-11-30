import { ActivityService } from './../services/services/activity.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Activity, Announcement } from '../models';
import { AnnouncementService } from '..';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-activity-carousel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
  ],
  templateUrl: './activity-carousel.component.html',
  styleUrl: './activity-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCarouselComponent implements OnInit {
  
  activities: Activity[] = [];
  groupedActivities: Activity[][] = [];
  
  firstCarouselIndex = 0;
  secondCarouselIndex = 0;
  thirdCarouselIndex = 0;

  constructor(private activityService: ActivityService) {
    this.loadActivities();
  }

  loadActivities() {
    this.activityService.getActivities().subscribe(activities => {
      this.activities = activities;
      this.groupActivities();
      this.secondCarouselIndex = 1;
      this.thirdCarouselIndex = 2;
    });
  }

  ngOnInit() {
    console.log('Actividades agrupadas:', this.groupedActivities);
    console.log('Actividades:', this.activities);
  }

  groupActivities() {
    // Agrupar actividades en grupos de 3
    this.groupedActivities = [];
    for (let i = 0; i < this.activities.length; i += 3) {
      this.groupedActivities.push(this.activities.slice(i, i + 3));
    }
  }


  prevSlide() {
    // Ir al slide anterior
    if (this.firstCarouselIndex > 0) {
      this.firstCarouselIndex--;
      this.secondCarouselIndex--;
      this.thirdCarouselIndex--;
    }
  }

  nextSlide() {
    // Ir al siguiente slide
    if (this.thirdCarouselIndex < this.activities.length - 1) {
      this.firstCarouselIndex++;
      this.secondCarouselIndex++;
      this.thirdCarouselIndex++;
    }
  }
}
