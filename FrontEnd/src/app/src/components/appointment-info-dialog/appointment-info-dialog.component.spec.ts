import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentInfoDialogComponent } from './appointment-info-dialog.component';

describe('AppointmentInfoDialogComponent', () => {
  let component: AppointmentInfoDialogComponent;
  let fixture: ComponentFixture<AppointmentInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
