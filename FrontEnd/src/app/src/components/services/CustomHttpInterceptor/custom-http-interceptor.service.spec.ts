import { TestBed } from '@angular/core/testing';

import { CustomHttpInterceptorService } from '../../../../jwt.interceptor';

describe('CustomHttpInterceptorService', () => {
  let service: CustomHttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomHttpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
