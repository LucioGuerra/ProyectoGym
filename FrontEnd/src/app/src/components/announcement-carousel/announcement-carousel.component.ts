import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal} from '@angular/core';
import { Announcement } from '../models/announcement.model';
import {NgOptimizedImage} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-announcement-carousel',
  standalone: true,
  imports: [NgOptimizedImage, MatTabGroup, MatTab],
  templateUrl: './announcement-carousel.component.html',
  styleUrl: './announcement-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementCarouselComponent implements OnInit, OnDestroy {
  currentIndex = signal(0);
  private intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.announcements.length);
    }, 3000);
  }

  onTabChange(event: any) {
    this.currentIndex.set(event.index);
  }

  announcements: Announcement[] = [
    {id: 1, title: 'First announcement', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', date: new Date(Date.now()),},
    {id: 2, title: 'Second announcement', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', date: new Date(Date.now()),},
    {id: 3, title: 'Third announcement', description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.', date: new Date(Date.now()),},
    {id: 3, title: 'Third announcement', description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.', date: new Date(Date.now()),},
    {id: 3, title: 'Third announcement', description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.', date: new Date(Date.now()),},
    {id: 3, title: 'Third announcement', description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.', date: new Date(Date.now()),},
    {id: 3, title: 'Third announcement', description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.', date: new Date(Date.now()),},
    {id: 3, title: 'Third announcement', description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.', date: new Date(Date.now()),},
  ];
}
