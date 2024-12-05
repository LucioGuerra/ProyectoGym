import {ActivatedRoute, Router} from '@angular/router';
import {Component, effect, OnInit} from '@angular/core';
import {AnnouncementService, AuthService} from '../services/services';
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
import { MainScreenComponent } from "../../layout/main-screen/main-screen.component";
import { Announcement } from '..';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MainScreenComponent
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './announcementCreation.component.html',
  styleUrls: ['./announcementCreation.component.scss'],
})
export class AnnouncementCreationComponent implements OnInit {
  readonly date = new FormControl(new Date());
  readonly serializedDate = new FormControl(new Date().toLocaleDateString('es-AR'));
  form: FormGroup;
  announcements: Announcement[] = [];
  announcementID: string | null = null;

  constructor(
    private announcementService: AnnouncementService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private auth0: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
        } else if (this.auth0.isClient()) {
          this.router.navigate(['/agenda']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    console.log('is admin? ', this.auth0.isAdmin(), 'is client? ', this.auth0.isClient());
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      date: this.date
    });
  }

  ngOnInit(): void {
    this.announcementID = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('ID:', this.announcementID);
    if (this.announcementID) {
      this.announcementService.getAnnouncementById(Number(this.announcementID)).subscribe((announcement: any) => {
        this.form.patchValue(announcement);
      });
    }
  }

  createAnnouncement() {
    if (this.form.valid) {
      const announcement: Announcement = this.form.value;
      console.log('Datos enviados:', announcement);
      this.announcementService.createAnnouncement(announcement).subscribe((announcements: any) => {
        console.log('Anuncio creado');
        this.form.markAsPristine();
        this.snackBar.open('Anuncio creado', 'Cerrar', {
          duration: 2000,
        });
      });
    } else {
      this.dialog.open(ErrorDialogComponent, {data: {message: 'Hubo un error, por favor intentelo de nuevo'}});
      console.error('Formulario inválido');
    }
  }

  editAnnouncement() {
    if (this.form.valid) {
      const announcement: Announcement = this.form.value;
      console.log('Datos enviados:', announcement);
      this.announcementService.updateAnnouncement(Number(this.announcementID!), announcement).subscribe((announcements: any) => {
        console.log('Anuncio editado');
        this.form.markAsPristine();
        this.snackBar.open('Anuncio editado', 'Cerrar', {
          duration: 2000,
        });
      });
    } else {
      this.dialog.open(ErrorDialogComponent, {data: {message: 'Hubo un error, por favor intentelo de nuevo'}});
      console.error('Formulario inválido');
    }
  }

  goBack() {
    if (this.form.dirty) {
      this.dialog.open(ConfirmationDialogComponent, {data: {message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.'}}).afterClosed().subscribe((result: boolean) => {
        if (result) {
          window.history.back();
        }
      });
    } else {
      window.history.back();
    }
  }


}
