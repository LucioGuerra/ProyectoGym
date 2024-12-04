import { PackageService } from './../services/services/package.service';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ElementRef,
  AfterViewInit,
  effect,
  OnInit
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/services';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { ToolbarComponent } from '../toolbar';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
import {ActivityService} from "../services/services";
import {Activity} from "../models";
import { ActivityCarouselComponent } from "../activity-carousel/activity-carousel.component";
import { Package } from '../models/package.models';
import { PackageCarouselComponent } from "../package-carousel/package-carousel.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CurrencyPipe, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule, ActivityCarouselComponent, PackageCarouselComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements AfterViewInit, OnInit {private sections: HTMLElement[] = [];
  private subscription = new Subscription();
  public activities: Activity[] = [];

  public packages: Package[] = [];

  constructor(
    private el: ElementRef, 
    private router: Router, 
    private auth0: AuthService, 
    private activityService: ActivityService, 
    private packageService: PackageService
  ) {
    effect(async () => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
          console.log("Me redirige a admin/agenda");
          this.router.navigate(['admin/agenda']);
        } else if (this.auth0.isClient()) {
          console.log("Me redirige a client/agenda");
          this.router.navigate(['/agenda']);
        } else {
          console.log("No es admin ni cliente");
          await this.auth0.handleAuthentication();
        }
      } else {
        await auth0.handleAuthentication();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.loadActivities();
    this.loadPackages();
  }

  ngAfterViewInit(): void {
    this.sections = Array.from(this.el.nativeElement.querySelectorAll('section'));
  }

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    const isMobile = window.innerWidth <= 768;
    console.log(isMobile, window.innerWidth);
    if (isMobile) {

    const currentIndex = this.sections.findIndex(section =>
      section.getBoundingClientRect().top >= 0
    );

    if (currentIndex !== -1) {
      if (event.deltaY > 0 && currentIndex < this.sections.length - 1) {
        this.sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
      } else if (event.deltaY < 0 && currentIndex > 0) {
        this.sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  private loadActivities() {
    this.activityService.getActivities().subscribe(activities => {
      this.activities = activities;
    });
  }

  private loadPackages() {
    this.packageService.getRandomPackages().subscribe(packages => {
      this.packages = packages;
    });
  }
}
