import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCarouselComponent } from './material-carousel.component';

describe('MaterialCarouselComponent', () => {
  let component: MaterialCarouselComponent;
  let fixture: ComponentFixture<MaterialCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
