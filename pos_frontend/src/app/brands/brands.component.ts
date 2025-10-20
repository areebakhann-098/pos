import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../core/services/brand/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  brands: any[] = [];
  brand = {
    name: '',
    description: ''
  };

  isEditMode = false;
  editId: string | null = null;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.getAllBrands();
  }

  // 🔹 Fetch all brands
  getAllBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brands = res;
      },
      error: (err) => console.error('Error fetching brands:', err)
    });
  }

  // 🔹 Add new brand
  addBrand() {
    if (!this.brand.name.trim()) {
      alert('Please enter brand name!');
      return;
    }

    this.brandService.createBrand(this.brand).subscribe({
      next: () => {
        alert('Brand created successfully!');
        this.brand = { name: '', description: '' };
        this.getAllBrands();
      },
      error: (err) => console.error('Error creating brand:', err)
    });
  }

  // 🔹 Edit brand
  editBrand(b: any) {
    this.isEditMode = true;
    this.editId = b.id;
    this.brand = { name: b.name, description: b.description };
  }

  // Update brand
  updateBrand() {
    if (!this.editId) return;

    this.brandService.updateBrand(this.editId, this.brand).subscribe({
      next: () => {
        alert('Brand updated successfully!');
        this.cancelEdit();
        this.getAllBrands();
      },
      error: (err) => console.error('Error updating brand:', err)
    });
  }

  // 🔹 Delete brand
  deleteBrand(id: string) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => this.getAllBrands(),
        error: (err) => console.error('Error deleting brand:', err)
      });
    }
  }

  // 🔹 Cancel edit
  cancelEdit() {
    this.isEditMode = false;
    this.editId = null;
    this.brand = { name: '', description: '' };
  }
}
