import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerListComponent } from './drawer-list.component';

describe('DrawerListComponent', () => {
  let component: DrawerListComponent;
  let fixture: ComponentFixture<DrawerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
