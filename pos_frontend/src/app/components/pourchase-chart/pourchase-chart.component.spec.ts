import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PourchaseChartComponent } from './pourchase-chart.component';

describe('PourchaseChartComponent', () => {
  let component: PourchaseChartComponent;
  let fixture: ComponentFixture<PourchaseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PourchaseChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PourchaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
