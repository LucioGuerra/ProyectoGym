import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerListClientComponent } from './drawer-list-client.component';

describe('DrawerListClientComponent', () => {
  let component: DrawerListClientComponent;
  let fixture: ComponentFixture<DrawerListClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerListClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerListClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
