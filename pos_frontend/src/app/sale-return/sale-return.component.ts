import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SaleReturnService } from '../core/services/sale_return/sale-return.service';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';
import { StockAdjustmentsService } from '../core/services/stock_adjustments/stock-adjustements.service';

interface Product {
  id?: number | string;
  product_name?: string;
  name?: string;
  price?: { purchase_price?: number };
  purchase_price?: number;
}

@Component({
  selector: 'app-sale-return',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.css'],
})
export class SaleReturnComponent implements OnInit {
  saleReturnForm: FormGroup;
  filteredProducts: Product[] = [];
  locations: any[] = [];
  saleReturns: any[] = [];
  message: string = '';
  loading: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private saleReturnService: SaleReturnService,
    private locationService: BusinessLocationService,
    private stockService: StockAdjustmentsService
  ) {
    this.saleReturnForm = this.fb.group({
      sale_id: ['', Validators.required],
      business_location_id: ['', Validators.required],
      reason: ['', Validators.required],
      products: this.fb.array([]),
      totalRefund: [{ value: 0, disabled: true }],
      searchQuery: [''],
    });

    this.setupSearchListener();
  }

  ngOnInit() {
    this.loadLocations();
    this.getAllReturns();
  }

  // Getter for products FormArray
  get products(): FormArray {
    return this.saleReturnForm.get('products') as FormArray;
  }

  get searchFormControl() {
    return this.saleReturnForm.get('searchQuery')!;
  }

  // Load business locations
  private loadLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res: any) => (this.locations = res.locations || []),
      error: () => (this.locations = []),
    });
  }

  // Debounced Product Search
  private setupSearchListener() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
          this.filteredProducts = [];
          return;
        }

        this.stockService.searchProducts(q).subscribe({
          next: (res: any) => (this.filteredProducts = res.data || []),
          error: () => (this.filteredProducts = []),
        });
      });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchFormControl.setValue(value);
    this.searchSubject.next(value);
  }

  // Add Product Row
  addProduct(product: Product) {
    if (!product) return;

    const existingIndex = this.products.controls.findIndex(
      (ctrl) => ctrl.get('productId')?.value === product.id
    );
    if (existingIndex !== -1) return;

    const group = this.fb.group({
      productId: [product.id],
      productName: [product.product_name || product.name || ''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitCost: [product.price?.purchase_price || product.purchase_price || 0, Validators.required],
      lineTotal: [{ value: product.price?.purchase_price || product.purchase_price || 0, disabled: true }],
    });

    group.valueChanges.subscribe((val) => {
      const total = (val.quantity || 0) * (val.unitCost || 0);
      group.get('lineTotal')?.setValue(total, { emitEvent: false });
      this.calculateTotalRefund();
    });

    this.products.push(group);
    this.calculateTotalRefund();
    this.searchFormControl.setValue('');
    this.filteredProducts = [];
  }

  // Remove Product
  removeItem(productId: number | string) {
    const index = this.products.controls.findIndex(
      (ctrl) => ctrl.get('productId')?.value === productId
    );
    if (index !== -1) this.products.removeAt(index);
    this.calculateTotalRefund();
  }

  // Calculate total refund
  calculateTotalRefund() {
    const total = this.products.controls.reduce((sum, ctrl) => {
      return sum + (ctrl.get('lineTotal')?.value || 0);
    }, 0);
    this.saleReturnForm.get('totalRefund')?.setValue(total);
  }

  // Submit Sale Return
  submitSaleReturn() {
    if (this.saleReturnForm.invalid) {
      this.saleReturnForm.markAllAsTouched();
      alert('Please fill all required fields!');
      return;
    }

    const productsArray = this.products.controls.map((ctrl) => ({
      product_id: ctrl.get('productId')?.value,
      quantity: ctrl.get('quantity')?.value,
      unit_cost: ctrl.get('unitCost')?.value,
    }));

    const payload = {
      sale_id: this.saleReturnForm.value.sale_id,
      business_location_id: this.saleReturnForm.value.business_location_id,
      reason: this.saleReturnForm.value.reason,
      products: productsArray,
    };


    this.loading = true;
    this.saleReturnService.createSaleReturn(payload).subscribe({
      next: () => {
        alert('✅ Sale Return created successfully!');
        this.loading = false;
        this.resetForm();
        this.getAllReturns();
      },
      error: (err) => {
        console.error('❌ Error creating sale return:', err);
        alert('❌ Failed to create sale return!');
        this.loading = false;
      },
    });
  }

  getAllReturns() {
    this.saleReturnService.getAllSaleReturns().subscribe({
      next: (res) => (this.saleReturns = res.data || []),
      error: (err) => console.error('Error fetching sale returns', err),
    });
  }

  resetForm() {
    this.saleReturnForm.reset();
    this.products.clear();
    this.saleReturnForm.get('totalRefund')?.setValue(0);
  }
}
