import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarrantiesService } from '../core/services/warrenties/warranties.service';

@Component({
  selector: 'app-warranties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.css']
})
export class WarrantiesComponent implements OnInit {

  warranties: any[] = [];
  warranty = {
    name: '',
    description: '',
    duration: '',
    duration_type: ''
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(private warrantyService: WarrantiesService) {}

  ngOnInit(): void {
    this.getAllWarranties();
  }

  // 📋 Fetch all warranties
  getAllWarranties() {
    this.warrantyService.getWarranties().subscribe({
      next: (res) => {
        this.warranties = Array.isArray(res) ? res : res.data || [];
      },
      error: (err) => console.error('Error fetching warranties:', err)
    });
  }

  // ➕ Create warranty
  addWarranty() {
    if (!this.warranty.name.trim() || !this.warranty.duration || !this.warranty.duration_type.trim()) {
      alert('⚠️ Please fill all required fields!');
      return;
    }

    this.warrantyService.createWarranty(this.warranty).subscribe({
      next: () => {
        alert('✅ Warranty added successfully!');
        this.resetForm();
        this.getAllWarranties();
      },
      error: (err) => console.error('Error adding warranty:', err)
    });
  }

  // ✏️ Edit warranty
  editWarranty(w: any) {
    this.isEditMode = true;
    this.editId = w.id;
    this.warranty = {
      name: w.name,
      description: w.description,
      duration: w.duration,
      duration_type: w.duration_type
    };
  }

  // 🔁 Update warranty
  updateWarranty() {
    if (!this.editId) return;

    this.warrantyService.updateWarranty(this.editId, this.warranty).subscribe({
      next: () => {
        alert('✅ Warranty updated successfully!');
        this.cancelEdit();
        this.getAllWarranties();
      },
      error: (err) => console.error('Error updating warranty:', err)
    });
  }

  // ❌ Delete warranty
  deleteWarranty(id: number) {
    if (confirm('Are you sure you want to delete this warranty?')) {
      this.warrantyService.deleteWarranty(id).subscribe({
        next: () => {
          alert('🗑️ Warranty deleted!');
          this.getAllWarranties();
        },
        error: (err) => console.error('Error deleting warranty:', err)
      });
    }
  }

  // 🚫 Cancel edit mode
  cancelEdit() {
    this.isEditMode = false;
    this.editId = null;
    this.resetForm();
  }

  // ♻️ Reset form
  resetForm() {
    this.warranty = {
      name: '',
      description: '',
      duration: '',
      duration_type: ''
    };
  }
}
