import { ChangeDetectionStrategy, Component } from '@angular/core';
import {DrawerComponent} from "../../components/drawer/drawer.component";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-main-screen',
  standalone: true,
    imports: [
        DrawerComponent,
        MatDivider
    ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainScreenComponent {

}
