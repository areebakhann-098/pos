import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentsReportComponent } from './adjustments-report.component';

describe('AdjustmentsReportComponent', () => {
  let component: AdjustmentsReportComponent;
  let fixture: ComponentFixture<AdjustmentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustmentsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
