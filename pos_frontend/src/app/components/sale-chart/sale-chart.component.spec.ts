import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleChartComponent } from './sale-chart.component';

describe('SaleChartComponent', () => {
  let component: SaleChartComponent;
  let fixture: ComponentFixture<SaleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
