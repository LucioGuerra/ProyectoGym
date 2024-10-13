import { Directive, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[carouselItem]'
})
export class CarouselItemDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
