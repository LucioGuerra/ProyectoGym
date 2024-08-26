import { ChangeDetectionStrategy, Component, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'], // Corrección aquí
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements AfterViewInit { // Implementación de AfterViewInit
  private sections: HTMLElement[] = [];
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

  constructor(private auth: AuthService, private el: ElementRef) {}

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
    this.auth.loginWithRedirect();
  }
}
