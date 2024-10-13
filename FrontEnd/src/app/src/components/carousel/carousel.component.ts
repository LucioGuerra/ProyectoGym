import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  TemplateRef
} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgStyle, NgTemplateOutlet} from "@angular/common";
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  imports: [MatIconModule, NgForOf, NgTemplateOutlet, MatButtonModule, NgStyle],
  standalone: true,
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition(':enter', [
        style({ opacity: 0 }), // El elemento entra con opacidad 0
        animate('500ms ease-in', style({ opacity: 1 })) // Anima hasta opacidad 1 (aparece)
      ]),
      transition(':leave', [
        animate('250ms ease-out', style({ opacity: 0.5 })) // Anima hasta opacidad 0 (desvanece)
      ])
    ])
  ]
})
export class CarouselComponent implements AfterViewInit {
  @Input() visibleItems = 3; // Número de elementos visibles
  @ContentChildren('carouselItem', { read: TemplateRef }) items!: QueryList<TemplateRef<any>>; // Elementos pasados por ng-content
  currentIndex = 0; // Índice actual del carrusel
  totalItems = 0; // Número total de elementos en el carrusel

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.totalItems = this.items.length;
    this.cdr.detectChanges();
  }

  next() {
    // Avanza al siguiente elemento de manera circular
    this.currentIndex = (this.currentIndex + 1) % this.totalItems;
  }

  previous() {
    // Retrocede al elemento anterior de manera circular
    this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
  }

  getVisibleItems(): TemplateRef<any>[] {
    const visible = [];
    for (let i = 0; i < this.visibleItems; i++) {
      const index = (this.currentIndex + i) % this.totalItems;
      visible.push(this.items.toArray()[index]);
    }
    return visible;
  }
}
