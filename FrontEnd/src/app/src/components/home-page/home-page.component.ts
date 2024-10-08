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
import { AuthService } from '../services/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CurrencyPipe, ToolbarComponent, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements AfterViewInit {
  private sections: HTMLElement[] = [];
  private subscription = new Subscription();

  public activities = [
    {id: 1, name: 'Actividad 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.', img: 'https://via.placeholder.com/150'},
    {id: 2, name: 'Actividad 2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.', img: 'https://via.placeholder.com/150'},
    {id: 3, name: 'Actividad 3', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.', img: 'https://via.placeholder.com/150'},
  ]
  public prices = [
    {id: 1, name: 'Pack 1', price:'15000', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.'},
    {id: 2, name: 'Pack 2', price:'25000',description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.'},
    {id: 3, name: 'Pack 3', price:'35000',description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac enim eget eros pulvinar fermentum.'},
  ]

  constructor(private el: ElementRef, private router: Router, private auth0: AuthService) {

    effect(() => {
      if(this.auth0.isAuthenticated()){
        if(this.auth0.isAdmin()){
          console.log("Me redirige a admin/agenda")
          this.router.navigate(['admin/agenda']);
        }
        else {
          //todo redirect to client page
        }
      }
      else{
        this.auth0.handleAuthentication();
      }
    }, { allowSignalWrites: true });

  }

  ngAfterViewInit(): void {
    this.sections = Array.from(this.el.nativeElement.querySelectorAll('section'));
  }

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent): void {
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

  login() {
    this.router.navigate(['/login']);
  }
}
