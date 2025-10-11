import { TestBed } from '@angular/core/testing';

import { BusinessLocationService } from './business-location.service';

describe('BusinessLocationService', () => {
  let service: BusinessLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
