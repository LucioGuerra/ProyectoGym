import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementCarouselComponent } from './announcement-carousel.component';

describe('AnnouncementCarouselComponent', () => {
  let component: AnnouncementCarouselComponent;
  let fixture: ComponentFixture<AnnouncementCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
