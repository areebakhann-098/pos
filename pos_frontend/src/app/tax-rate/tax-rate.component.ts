import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxRateService } from '../core/services/tax_rate/tax-rate.service';

@Component({
  selector: 'app-tax-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tax-rate.component.html',
  styleUrls: ['./tax-rate.component.css']
})
export class TaxRateComponent implements OnInit {
  taxRates: any[] = [];
  tax = {
    name: '',
    amount: ''
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(private taxRateService: TaxRateService) {}

  ngOnInit(): void {
    this.getAllTaxRates();
  }

  // 📋 Get all tax rates
  getAllTaxRates() {
    this.taxRateService.getAllTaxRates().subscribe({
      next: (res) => {
        this.taxRates = Array.isArray(res) ? res : res.data || [];
      },
      error: (err) => console.error('Error fetching tax rates:', err)
    });
  }

  // ➕ Add new tax rate
  addTaxRate() {
    if (!this.tax.name.trim() || !this.tax.amount) {
      alert('Please fill all fields!');
      return;
    }

    this.taxRateService.createTaxRate(this.tax).subscribe({
      next: () => {
        alert('Tax rate added successfully!');
        this.tax = { name: '', amount: '' };
        this.getAllTaxRates();
      },
      error: (err) => console.error('Error adding tax rate:', err)
    });
  }

  // ✏️ Edit tax rate
  editTaxRate(t: any) {
    this.isEditMode = true;
    this.editId = t.id;
    this.tax = {
      name: t.name,
      amount: t.amount
    };
  }

  // 🔄 Update tax rate
  updateTaxRate() {
    if (!this.editId) return;

    this.taxRateService.updateTaxRate(this.editId, this.tax).subscribe({
      next: () => {
        alert('Tax rate updated successfully!');
        this.cancelEdit();
        this.getAllTaxRates();
      },
      error: (err) => console.error('Error updating tax rate:', err)
    });
  }

  // ❌ Delete tax rate
  deleteTaxRate(id: number) {
    if (confirm('Are you sure you want to delete this tax rate?')) {
      this.taxRateService.deleteTaxRate(id).subscribe({
        next: () => {
          alert('Tax rate deleted successfully!');
          this.getAllTaxRates();
        },
        error: (err) => console.error('Error deleting tax rate:', err)
      });
    }
  }

  // 🔙 Cancel edit
  cancelEdit() {
    this.isEditMode = false;
    this.editId = null;
    this.tax = { name: '', amount: '' };
  }
}
