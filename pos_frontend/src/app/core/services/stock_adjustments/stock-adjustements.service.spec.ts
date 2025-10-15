import { TestBed } from '@angular/core/testing';

import { StockAdjustementsService } from './stock-adjustements.service';

describe('StockAdjustementsService', () => {
  let service: StockAdjustementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockAdjustementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
