import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentFormComponent } from './create-appointment-form.component';

describe('CreateAppointmentFormComponent', () => {
  let component: CreateAppointmentFormComponent;
  let fixture: ComponentFixture<CreateAppointmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAppointmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
