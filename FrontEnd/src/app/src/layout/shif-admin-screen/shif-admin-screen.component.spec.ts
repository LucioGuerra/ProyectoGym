import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifAdminScreenComponent } from './shif-admin-screen.component';

describe('ShifAdminScreenComponent', () => {
  let component: ShifAdminScreenComponent;
  let fixture: ComponentFixture<ShifAdminScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShifAdminScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShifAdminScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
