import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent implements OnInit {
  products: any[] = [];

  // Totals
  totalQty = 0;
  totalPurchasePrice = 0;
  totalSellPrice = 0;
    totalProfit = 0; 


  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getAllProducts();
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

        this.products = this.products.map(p => ({
          ...p,
          quantity: Number(p.quantity) || 0,
          purchase_price: Number(p.price?.purchase_price) || 0,
          sell_price: Number(p.price?.sell_price) || 0
        }));

        this.calculateTotals();
      },
      error: (err) => {
        console.error(' Error fetching products:', err);
      }
    });
  }

  calculateTotals(): void {
    this.totalQty = this.products.reduce((sum, p) => sum + p.quantity, 0);
    this.totalPurchasePrice = this.products.reduce((sum, p) => sum + p.purchase_price, 0);
    this.totalSellPrice = this.products.reduce((sum, p) => sum + p.sell_price, 0);
        this.totalProfit = this.totalSellPrice - this.totalPurchasePrice;

  }
}
