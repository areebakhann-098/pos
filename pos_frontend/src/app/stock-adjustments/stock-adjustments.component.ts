import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-adjustments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-adjustments.component.html',
  styleUrls: ['./stock-adjustments.component.css']
})
export class StockAdjustmentsComponent {
  stockForm: FormGroup;
  isDisabled = false;


  constructor(private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      businessLocation: [''],
      refNo: [''],
      adjustmentDate: [''],
      adjustmentType: [''],
      products: this.fb.array([]),
      totalRecovered: [0],
      reason: ['']
    });

    // Start with 1 empty row
    this.addProduct();
  }

  // Getter for products array
  get products(): FormArray {
    return this.stockForm.get('products') as FormArray;
  }

  // Add new product row
  addProduct() {
    const productGroup = this.fb.group({
      productName: [''],
      quantity: [0],
      unitCost: [0],
      lineTotal: [{ value: 0, disabled: true }]
    });

    // Listen for changes
    productGroup.valueChanges.subscribe(val => {
      const lineTotal = (val.quantity || 0) * (val.unitCost || 0);
      productGroup.get('lineTotal')?.setValue(lineTotal, { emitEvent: false });
      this.calculateTotalRecovered();
    });

    this.products.push(productGroup);
  }

  // Remove product row
  removeProduct(index: number) {
    this.products.removeAt(index);
    this.calculateTotalRecovered();
  }

  // Calculate overall total recovered
  calculateTotalRecovered() {
    let total = 0;
    this.products.controls.forEach((ctrl: any) => {
      total += ctrl.get('lineTotal')?.value || 0;
    });
    this.stockForm.get('totalRecovered')?.setValue(total);
  }

  // Submit form
  onSubmit() {
    console.log(this.stockForm.getRawValue());
  }
}
