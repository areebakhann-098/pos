import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../core/services/categories/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  category = {
    id: '',
    name: '',
    description: '',
    sub_category: '',
  };
  isEditMode = false;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  //  Get all categories
  getCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  //  Add new category
  onSubmit() {
    if (!this.category.name) return alert('Category name is required');

    this.categoriesService.createCategory(this.category).subscribe({
      next: () => {
        alert('Category added successfully!');
        this.category = { id: '', name: '', description: '', sub_category: '' };
        this.getCategories();
      },
      error: (err) => console.error('Error creating category:', err),
    });
  }

  //  Edit existing category
  editCategory(cat: any) {
    this.isEditMode = true;
    this.category = { ...cat };
  }

  //  Update category
  updateCategory() {
    if (!this.category.id) return alert('No category selected');

    this.categoriesService.updateCategory(this.category.id, this.category).subscribe({
      next: () => {
        alert('Category updated successfully!');
        this.isEditMode = false;
        this.category = { id: '', name: '', description: '', sub_category: '' };
        this.getCategories();
      },
      error: (err) => console.error('Error updating category:', err),
    });
  }

  //  Cancel edit
  cancelEdit() {
    this.isEditMode = false;
    this.category = { id: '', name: '', description: '', sub_category: '' };
  }

  //  Delete category
  deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.categoriesService.deleteCategory(id).subscribe({
      next: () => this.getCategories(),
      error: (err) => console.error('Error deleting category:', err),
    });
  }
}
