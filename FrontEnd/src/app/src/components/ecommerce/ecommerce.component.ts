import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [],
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EcommerceComponent {

}
