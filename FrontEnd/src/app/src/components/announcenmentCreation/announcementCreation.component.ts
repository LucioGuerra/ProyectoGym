import { Component } from '@angular/core';
import { AnnouncementService } from '../services/services';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../toolbar';
import { DrawerComponent } from "../drawer/drawer.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

interface Announcement {
  id: any;
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-shif-admin-screen',
  standalone: true,
  imports: [
    MatMenuModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ToolbarComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DrawerComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './announcementCreation.component.html',
  styleUrls: ['./announcementCreation.component.scss'],
})
export class AnnouncementCreationComponent {
  readonly date = new FormControl(new Date());
  readonly serializedDate = new FormControl(new Date().toLocaleDateString('es-AR'));
  form: FormGroup;
  announcements: Announcement[] = [];

  constructor(private announcementService: AnnouncementService) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      date: this.date
    });
  }

  createAnnouncement() {
    if (this.form.valid) {
      const announcement: Announcement = this.form.value;
      console.log('Datos enviados:', announcement);
      /*this.announcementService.createAnnouncement(announcement).subscribe((announcements: any) => {
        this.announcements.push(announcement);
        alert('Anuncio creado');
      });*/
    } else {
      console.error('Formulario inválido');
    }
  }


}
