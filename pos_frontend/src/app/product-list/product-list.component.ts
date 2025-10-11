import { Component } from '@angular/core';
import { ProductService } from '../core/services/product/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getAllProducts();
  }
onEdit(product: any) {
    this.router.navigate(['/addproduct/edit/:id'], {
      queryParams: { id: product.id },
    });
  }

  // 🔴 Delete Product
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('🗑️ Product deleted successfully!');
          this.getAllProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product!');
        },
      });
    }
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        console.log('📦 Product data:', res);

        // 🔹 API response structure handle karne ke liye
        if (Array.isArray(res)) {
          this.products = res;
        } else if (res?.data) {
          this.products = res.data;
        } else if (res?.products) {
          this.products = res.products;
        } else {
          this.products = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching products:', err);
      }
    });
  }

}