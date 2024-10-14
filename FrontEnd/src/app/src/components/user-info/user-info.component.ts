import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DrawerComponent} from "../drawer/drawer.component";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    DrawerComponent
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {

}
