import { TestBed } from '@angular/core/testing';

import { EcommerceProductsService } from './ecommerce-products.service';

describe('EcommerceProductsService', () => {
  let service: EcommerceProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcommerceProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
