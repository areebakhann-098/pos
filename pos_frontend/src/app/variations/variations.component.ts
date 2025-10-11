import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VariationService } from '../core/services/variation/variation.service';

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.css']
})
export class VariationsComponent implements OnInit {
  variations: any[] = [];
  variation = {
    name: '',
    value: ''
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
    next: (res) => {
      
      this.variations = res.data || []; // 👈 yahan fix
    },
    error: (err) => {
      console.error('Error fetching variations', err);
    }
  });
}

  // 🔹 Create new variation
  addVariation() {
    if (!this.variation.name.trim() || !this.variation.value.trim()) {
      alert('Please fill both fields!');
      return;
    }

    this.variationService.createVariation(this.variation).subscribe({
      next: (res) => {
        alert('Variation created successfully!');
        this.variation = { name: '', value: '' };
        this.getAllVariations();
      },
      error: (err) => {
        console.error('Error creating variation', err);
      }
    });
  }
editVariation(v: any) {
  this.isEditMode = true;
  this.editId = v.id;
  this.variation = { 
    name: v.variation_name, 
    value: v.variation_value 
  };
}


 updateVariation() {
  if (!this.editId) return;

  const updatedData = {
    variation_name: this.variation.name,
    variation_value: this.variation.value
  };

  this.variationService.updateVariation(this.editId, updatedData).subscribe({
    next: () => {
      alert('Variation updated successfully!');
      this.cancelEdit();
      this.getAllVariations();
    },
    error: (err) => {
      console.error('Error updating variation', err);
    }
  });
}


  // 🔹 Delete variation
  deleteVariation(id: number) {
    if (confirm('Are you sure you want to delete this variation?')) {
      this.variationService.deleteVariation(id).subscribe({
        next: () => {
          this.getAllVariations();
        },
        error: (err) => {
          console.error('Error deleting variation', err);
        }
      });
    }
  }

  // 🔹 Cancel edit
  cancelEdit() {
    this.isEditMode = false;
    this.editId = null;
    this.variation = { name: '', value: '' };
  }
}
