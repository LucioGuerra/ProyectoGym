import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifClientScreenComponent } from './shif-client-screen.component';

describe('ShifClientScreenComponent', () => {
  let component: ShifClientScreenComponent;
  let fixture: ComponentFixture<ShifClientScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShifClientScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShifClientScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
