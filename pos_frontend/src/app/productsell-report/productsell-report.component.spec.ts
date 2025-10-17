import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsellReportComponent } from './productsell-report.component';

describe('ProductsellReportComponent', () => {
  let component: ProductsellReportComponent;
  let fixture: ComponentFixture<ProductsellReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsellReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsellReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
