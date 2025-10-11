import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../core/services/discount/discount.service';

@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {
  // 🧾 Discount list
  discounts: any[] = [];

  // ✏️ Form fields
  discount = {
    id: null,
    name: '',
    discount_type: '',
    discount_amount: null,
  };

  // Edit mode flag
  isEditMode = false;

  constructor(private discountService: DiscountService) {}

  ngOnInit() {
    this.getAllDiscounts();
  }

  // ✅ Fetch all discounts
  getAllDiscounts() {
    this.discountService.getDiscounts().subscribe({
      next: (res) => {
        this.discounts = res.data || [];
      },
      error: (err) => {
        console.error('❌ Error fetching discounts:', err);
      },
    });
  }

  // ✅ Create new discount
  addDiscount() {
    if (!this.discount.name || !this.discount.discount_type || !this.discount.discount_amount) {
      alert('Please fill all fields!');
      return;
    }

    const payload = {
      name: this.discount.name,
      discount_type: this.discount.discount_type,
      discount_amount: this.discount.discount_amount,
    };

    this.discountService.createDiscount(payload).subscribe({
      next: (res) => {
        alert('✅ Discount added successfully!');
        this.resetForm();
        this.getAllDiscounts();
      },
      error: (err) => {
        console.error('❌ Error creating discount:', err);
        alert('Error saving discount!');
      },
    });
  }

  // ✏️ Edit Discount
  editDiscount(d: any) {
    this.discount = { ...d }; // copy data
    this.isEditMode = true;
  }

  // 🔄 Update Discount
  updateDiscount() {
    if (!this.discount.id) return;

    this.discountService.updateDiscount(this.discount.id, this.discount).subscribe({
      next: (res) => {
        alert('✅ Discount updated successfully!');
        this.resetForm();
        this.getAllDiscounts();
        this.isEditMode = false;
      },
      error: (err) => {
        console.error('❌ Error updating discount:', err);
        alert('Error updating discount!');
      },
    });
  }

  // 🗑️ Delete Discount
  deleteDiscount(id: number) {
    if (!confirm('Are you sure you want to delete this discount?')) return;

    this.discountService.deleteDiscount(id).subscribe({
      next: (res) => {
        alert('🗑️ Discount deleted successfully!');
        this.getAllDiscounts();
      },
      error: (err) => {
        console.error('❌ Error deleting discount:', err);
        alert('Error deleting discount!');
      },
    });
  }

  // 🔁 Reset form
  resetForm() {
    this.discount = {
      id: null,
      name: '',
      discount_type: '',
      discount_amount: null,
    };
    this.isEditMode = false;
  }

  // ❌ Cancel edit mode
  cancelEdit() {
    this.resetForm();
  }
}
