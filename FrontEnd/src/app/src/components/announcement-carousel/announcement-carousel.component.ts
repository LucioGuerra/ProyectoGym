import { ChangeDetectionStrategy, Component } from '@angular/core';
import {CarouselComponent} from "../carousel/carousel.component";
import {MatCardModule} from "@angular/material/card";
import {CarouselItemDirective} from "../carousel/carousel-item.directive";

@Component({
  selector: 'app-announcement-carousel',
  standalone: true,
  imports: [
    CarouselComponent,
    MatCardModule,
    CarouselItemDirective
  ],
  templateUrl: './announcement-carousel.component.html',
  styleUrl: './announcement-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementCarouselComponent {

}
