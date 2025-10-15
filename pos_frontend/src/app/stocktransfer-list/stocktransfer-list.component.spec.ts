import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktransferListComponent } from './stocktransfer-list.component';

describe('StocktransferListComponent', () => {
  let component: StocktransferListComponent;
  let fixture: ComponentFixture<StocktransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StocktransferListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StocktransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
