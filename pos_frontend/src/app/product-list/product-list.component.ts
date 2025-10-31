import { Component } from '@angular/core';
import { ProductService } from '../core/services/product/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = [];
    loading: boolean = true; 

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getAllProducts();
  }
onEdit(product: any) {
    this.router.navigate(['/home/addproduct/edit/:id'], {
      queryParams: { id: product.id },
    });
  }

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
        console.error(' Error fetching products:', err);
      }
    });
  }

}