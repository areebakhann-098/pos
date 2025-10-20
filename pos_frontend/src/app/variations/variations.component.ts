import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VariationService } from '../core/services/variation/variation.service';

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.css'],
})
export class VariationsComponent implements OnInit {
  variations: any[] = [];

  // 👇 For input fields
  variation = {
    name: '',
    valuesText: ''
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(private variationService: VariationService) {}

  ngOnInit(): void {
    this.getAllVariations();
  }

  // 🔹 Fetch all variations
  getAllVariations() {
    this.variationService.getAllVariations().subscribe({
      next: (res) => (this.variations = res.data || []),
      error: (err) => console.error('Error fetching variations:', err),
    });
  }

  // 🔹 Create a new variation
  addVariation() {
    if (!this.variation.name.trim()) {
      alert('Please enter a variation name!');
      return;
    }

    const valuesArray = this.variation.valuesText
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    if (valuesArray.length === 0) {
      alert('Please add at least one variation value!');
      return;
    }

    const payload = {
      name: this.variation.name,
      values: valuesArray,
    };

    this.variationService.createVariation(payload).subscribe({
      next: () => {
        alert('Variation created successfully!');
        this.resetForm();
        this.getAllVariations();
      },
      error: (err) => console.error('Error creating variation:', err),
    });
  }

  // 🔹 Edit variation
  editVariation(v: any) {
    this.isEditMode = true;
    this.editId = v.id;
    this.variation.name = v.variation_name;
    this.variation.valuesText = v.values.map((val: any) => val.value_name).join(', ');
  }

  // 🔹 Update variation
  updateVariation() {
    if (!this.editId) return;

    const valuesArray = this.variation.valuesText
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    const payload = {
      name: this.variation.name,
      values: valuesArray,
    };

    this.variationService.updateVariation(this.editId, payload).subscribe({
      next: () => {
        alert('Variation updated successfully!');
        this.cancelEdit();
        this.getAllVariations();
      },
      error: (err) => console.error('Error updating variation:', err),
    });
  }

  // 🔹 Delete variation
  deleteVariation(id: number) {
    if (confirm('Are you sure you want to delete this variation?')) {
      this.variationService.deleteVariation(id).subscribe({
        next: () => {
          alert('Variation deleted successfully!');
          this.getAllVariations();
        },
        error: (err) => console.error('Error deleting variation:', err),
      });
    }
  }

  // 🔹 Cancel edit mode
  cancelEdit() {
    this.isEditMode = false;
    this.editId = null;
    this.resetForm();
  }

  // 🔹 Reset form
  resetForm() {
    this.variation = { name: '', valuesText: '' };
  }
}
