import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatPackageFormComponent } from './creat-package-form.component';

describe('CreatPackageFormComponent', () => {
  let component: CreatPackageFormComponent;
  let fixture: ComponentFixture<CreatPackageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatPackageFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatPackageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
