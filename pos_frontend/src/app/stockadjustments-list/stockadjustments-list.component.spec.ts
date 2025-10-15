import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockadjustmentsListComponent } from './stockadjustments-list.component';

describe('StockadjustmentsListComponent', () => {
  let component: StockadjustmentsListComponent;
  let fixture: ComponentFixture<StockadjustmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockadjustmentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockadjustmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
