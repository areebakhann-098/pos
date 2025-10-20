import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterEvent, RouterLink } from '@angular/router';
import { SaleService } from '../core/services/sale/sale.service';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css'
})
export class SaleListComponent {
  sales: any[] = [];
  expandedIndex: number | null = null; // 👈 Track which row is expanded

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
      },
      error: (err) => {
        console.error('❌ Error fetching sales:', err);
      },
    });
  }
}
