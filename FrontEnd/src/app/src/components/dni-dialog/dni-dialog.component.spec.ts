import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DniDialogComponent } from './dni-dialog.component';

describe('DniDialogComponent', () => {
  let component: DniDialogComponent;
  let fixture: ComponentFixture<DniDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DniDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DniDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
