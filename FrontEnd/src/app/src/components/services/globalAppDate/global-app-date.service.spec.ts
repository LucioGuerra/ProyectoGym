import { TestBed } from '@angular/core/testing';

import { GlobalAppDateService } from './global-app-date.service';

describe('GlobalAppDateService', () => {
  let service: GlobalAppDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalAppDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
