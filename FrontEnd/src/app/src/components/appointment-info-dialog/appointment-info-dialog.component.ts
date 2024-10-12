import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-appointment-info-dialog',
  standalone: true,
  imports: [],
  templateUrl: './appointment-info-dialog.component.html',
  styleUrl: './appointment-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentInfoDialogComponent {

}
