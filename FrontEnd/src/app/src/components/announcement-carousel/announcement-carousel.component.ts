import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-announcement-carousel',
  standalone: true,
  imports: [],
  templateUrl: './announcement-carousel.component.html',
  styleUrl: './announcement-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementCarouselComponent {

}
