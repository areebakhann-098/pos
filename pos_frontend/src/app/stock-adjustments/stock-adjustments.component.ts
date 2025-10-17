import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { StockAdjustmentsService } from '../core/services/stock_adjustments/stock-adjustements.service';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';
import { ContactService } from '../core/services/contact/contact.service';

interface Product {
  id?: number | string;
  product_name?: string;
  name?: string;
  price?: { purchase_price?: number };
  purchase_price?: number;
}

@Component({
  selector: 'app-stock-adjustments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stock-adjustments.component.html',
  styleUrls: ['./stock-adjustments.component.css']
})
export class StockAdjustmentsComponent implements OnInit {
  stockForm: FormGroup;
  filteredProducts: Product[] = [];
  locations: any[] = [];
  suppliers: any[] = [];
  private searchSubject = new Subject<string>();
  isEditMode = false;
  editId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private stockService: StockAdjustmentsService,
    private locationService: BusinessLocationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      businessLocation: ['', Validators.required],
      supplier: ['', Validators.required],
      refNo: ['', Validators.required],
      adjustmentDate: ['', Validators.required],
      adjustmentType: ['', Validators.required],
      products: this.fb.array([]),
      totalRecovered: [{ value: 0, disabled: true }],
      reason: ['', Validators.required],
      searchQuery: ['']
    });

    this.setupSearchListener();
  }

  ngOnInit() {
    this.loadLocations();
    this.getSuppliers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.editId = +idParam;
      this.loadAdjustmentById(this.editId);
    }
  }

  get products(): FormArray {
    return this.stockForm.get('products') as FormArray;
  }

  get searchFormControl() {
    return this.stockForm.get('searchQuery')!;
  }

  getSuppliers() {
    this.contactService.getContacts().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.suppliers = res.data
            .filter((c: any) => c.contact_type === 'Supplier')
            .map((c: any) => ({
              id: c.id,
              name: [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(' ')
            }));
        }
      },
      error: (err) => console.error('❌ Error fetching suppliers:', err)
    });
  }

  private loadLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res: any) => (this.locations = res.locations || []),
      error: () => (this.locations = [])
    });
  }

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
          error: () => (this.filteredProducts = [])
        });
      });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchFormControl.setValue(value);
    this.searchSubject.next(value);
  }

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
      lineTotal: [{ value: product.price?.purchase_price || product.purchase_price || 0, disabled: true }]
    });

    group.valueChanges.subscribe((val) => {
      const lineTotal = (val.quantity || 0) * (val.unitCost || 0);
      group.get('lineTotal')?.setValue(lineTotal, { emitEvent: false });
      this.calculateTotalRecovered();
    });

    this.products.push(group);
    this.calculateTotalRecovered();
    this.searchFormControl.setValue('');
    this.filteredProducts = [];
  }

  removeItem(productId: number | string) {
    const index = this.products.controls.findIndex(
      (ctrl) => ctrl.get('productId')?.value === productId
    );
    if (index !== -1) this.products.removeAt(index);
    this.calculateTotalRecovered();
  }

  calculateTotalRecovered() {
    const total = this.products.controls.reduce((sum, ctrl) => {
      return sum + (ctrl.get('lineTotal')?.value || 0);
    }, 0);
    this.stockForm.get('totalRecovered')?.setValue(total);
  }

  loadAdjustmentById(id: number) {
    this.stockService.getAdjustmentById(id).subscribe({
      next: (res: any) => {
        const adj = res?.data || res;
        if (!adj) return;

        this.stockForm.patchValue({
          businessLocation: adj.businessLocation?.id || adj.business_location || '',
          supplier: adj.contacts?.id || adj.contact_id || '',
          refNo: adj.reference || adj.reference_no || '',
          adjustmentDate: adj.date || adj.adjustment_date || '',
          adjustmentType: adj.adjustment_type || '',
          totalRecovered: adj.recovery_amount || adj.total_recovered || 0,
          reason: adj.reason || ''
        });

        this.products.clear();

        const productList = adj.products || adj.productDetails || (adj.product ? [adj.product] : []);

        productList.forEach((p: any) => {
          const group = this.fb.group({
            productId: [p.product_id || p.id],
            productName: [p.product_name || p.name],
            quantity: [p.quantity || 1, [Validators.required, Validators.min(1)]],
            unitCost: [
              p.unit_cost || p.purchase_price || p.price?.purchase_price || 0,
              Validators.required
            ],
            lineTotal: [{
              value: (p.quantity || 1) * (p.unit_cost || p.purchase_price || p.price?.purchase_price || 0),
              disabled: true
            }]
          });

          group.valueChanges.subscribe((val) => {
            const total = (val.quantity || 0) * (val.unitCost || 0);
            group.get('lineTotal')?.setValue(total, { emitEvent: false });
            this.calculateTotalRecovered();
          });

          this.products.push(group);
        });

        this.calculateTotalRecovered();
      },
      error: (err) => console.error('❌ Error loading adjustment:', err)
    });
  }

  /** ✅ Submit for Create or Update */
 onSubmit() {
  if (this.stockForm.invalid) {
    this.stockForm.markAllAsTouched();
    alert('Please fill all required fields!');
    return;
  }

  // ✅ Create proper products array for backend
  const productsArray = this.products.controls.map((ctrl) => ({
    product_id: ctrl.get('productId')?.value,
    quantity: ctrl.get('quantity')?.value,
    unit_cost: ctrl.get('unitCost')?.value,
  }));

  const payload = {
    contact_id: this.stockForm.value.supplier,
    business_location: this.stockForm.value.businessLocation,
    reference_no: this.stockForm.value.refNo,
    adjustment_date: this.stockForm.value.adjustmentDate,
    adjustment_type: this.stockForm.value.adjustmentType,
    reason: this.stockForm.value.reason,
    products: productsArray, // ✅ send products array
  };

  console.log('🧾 Final Payload:', payload);

  if (this.isEditMode && this.editId) {
    this.stockService.updateAdjustment(this.editId, payload).subscribe({
      next: () => {
        alert('✅ Stock Adjustment updated successfully!');
        this.resetForm();
        this.router.navigate(['/stockadjustments_list']);
      },
      error: (err) => {
        console.error('❌ Error updating adjustment:', err);
        alert('❌ Failed to update stock adjustment!');
      },
    });
  } else {
    this.stockService.createStockAdjustment(payload).subscribe({
      next: () => {
        alert('✅ Stock Adjustment created successfully!');
        this.resetForm();
        this.router.navigate(['/stockadjustments_list']);
      },
      error: (err) => {
        console.error('❌ Error saving adjustment:', err);
        alert('❌ Failed to save stock adjustment!');
      },
    });
  }
}


  /** 🔁 Reset form after submit */
  private resetForm() {
    this.stockForm.reset();
    this.products.clear();
    this.stockForm.get('totalRecovered')?.setValue(0);
    this.isEditMode = false;
    this.editId = null;
  }
}
