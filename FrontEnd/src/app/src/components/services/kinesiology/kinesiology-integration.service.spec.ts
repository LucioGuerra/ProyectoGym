import { TestBed } from '@angular/core/testing';

import { KinesiologyIntegrationService } from './kinesiology-integration.service';

describe('KinesiologyIntegrationService', () => {
  let service: KinesiologyIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KinesiologyIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
