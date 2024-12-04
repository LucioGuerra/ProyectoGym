import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCarouselComponent } from './activity-carousel.component';

describe('ActivityCarouselComponent', () => {
  let component: ActivityCarouselComponent;
  let fixture: ComponentFixture<ActivityCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
