import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
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
  @Input() appointmentId: string | null = null;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  startTime: Date | null = null;
  endTime: Date | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentId'] && this.appointmentId) {
      // Lógica para cargar los datos del turno si `appointmentId` está presente
      this.loadAppointmentData(this.appointmentId);
    }
  }

  private loadAppointmentData(id: string): void {
    // Aquí realizarías la llamada al servicio para obtener los datos del turno.
    // Ejemplo simulado:
    const appointmentData = {
      start: new Date(), // Fecha de inicio del turno
      end: new Date(),   // Fecha de fin del turno
      startTime: new Date(), // Hora de inicio
      endTime: new Date(),   // Hora de fin
    };

    // Rellenar el formulario con los datos existentes
    this.range.patchValue({
      start: appointmentData.start,
      end: appointmentData.end,
    });
    this.startTime = appointmentData.startTime;
    this.endTime = appointmentData.endTime;
  }

  saveAppointment(): void {
    if (this.appointmentId) {
      // Si existe un `appointmentId`, actualizar el turno (PATCH)
      console.log('Actualizar turno con ID:', this.appointmentId);
      console.log('Datos del formulario:', this.range.value);
      console.log('Hora de inicio:', this.startTime);
      console.log('Hora de fin:', this.endTime);
      // Aquí iría la lógica para hacer la actualización en el backend
    } else {
      // Si no hay `appointmentId`, crear un nuevo turno (POST)
      console.log('Crear nuevo turno');
      console.log('Datos del formulario:', this.range.value);
      console.log('Hora de inicio:', this.startTime);
      console.log('Hora de fin:', this.endTime);
      // Aquí iría la lógica para crear el turno en el backend
    }
  }
}
