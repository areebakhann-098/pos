import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SaleService } from '../core/services/sale/sale.service';

@Component({
  selector: 'app-productsell-report',
  imports: [CommonModule],
  templateUrl: './productsell-report.component.html',
  styleUrl: './productsell-report.component.css'
})
export class ProductsellReportComponent {
  sales: any[] = [];
  expandedIndex: number | null = null;

  // 🔹 Totals
  totalSalesCount = 0;
  totalItemsCount = 0;
  totalAmount = 0;
  totalFinalAmount = 0;
  totalPaidAmount = 0;

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit(): void {
    this.getAllSales();
  }

  toggleSaleDetails(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  getAllSales() {
    this.saleService.getAllSales().subscribe({
      next: (res: any) => {
        console.log('🧾 Sale data:', res);
        if (Array.isArray(res)) {
          this.sales = res;
        } else if (res?.data) {
          this.sales = res.data;
        } else {
          this.sales = [];
        }

        // 🔹 Calculate totals
        this.calculateTotals();
      },
      error: (err) => {
        console.error('❌ Error fetching sales:', err);
      },
    });
  }

  calculateTotals() {
    this.totalSalesCount = this.sales.length;
    this.totalItemsCount = this.sales.reduce((sum, s) => sum + (s.total_items || 0), 0);
    this.totalAmount = this.sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    this.totalFinalAmount = this.sales.reduce((sum, s) => sum + (s.final_amount || 0), 0);
    this.totalPaidAmount = this.sales.reduce((sum, s) => sum + (s.amount_paid || 0), 0);
  }
}
