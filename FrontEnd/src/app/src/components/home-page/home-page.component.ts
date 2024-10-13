import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ElementRef,
  AfterViewInit,
  effect
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

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CurrencyPipe, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements AfterViewInit {private sections: HTMLElement[] = [];
  private subscription = new Subscription();
  public activities: Activity[] = [];

  public prices = [
    {id: 1, name: 'Pack 1', price: '15000', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.'},
    {id: 2, name: 'Pack 2', price: '25000', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.'},
    {id: 3, name: 'Pack 3', price: '35000', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.'},
  ];

  constructor(private el: ElementRef, private router: Router, private auth0: AuthService, private activityService: ActivityService) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
          console.log("Me redirige a admin/agenda");
          this.router.navigate(['admin/agenda']);
        } else if (this.auth0.isClient()) {
          console.log("Me redirige a client/agenda");
          this.router.navigate(['/agenda']);
        } else {
          console.log("No es admin ni cliente");
        }
      } else {
        this.auth0.handleAuthentication();
      }
    }, { allowSignalWrites: true });
  }

  ngAfterViewInit(): void {
    this.sections = Array.from(this.el.nativeElement.querySelectorAll('section'));
    this.loadActivities();
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
}
