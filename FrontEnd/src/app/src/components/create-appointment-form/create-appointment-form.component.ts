import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-create-appointment-form',
  standalone: true,providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './create-appointment-form.component.html',
  styleUrl: './create-appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAppointmentFormComponent {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  startTime: Date[] | undefined;
  endTime: Date[] | undefined;
}
