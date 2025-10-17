import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktransferReportComponent } from './stocktransfer-report.component';

describe('StocktransferReportComponent', () => {
  let component: StocktransferReportComponent;
  let fixture: ComponentFixture<StocktransferReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StocktransferReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StocktransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
