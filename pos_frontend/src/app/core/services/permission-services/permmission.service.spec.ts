import { TestBed } from '@angular/core/testing';

import { PermmissionService } from './permmission.service';

describe('PermmissionService', () => {
  let service: PermmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
