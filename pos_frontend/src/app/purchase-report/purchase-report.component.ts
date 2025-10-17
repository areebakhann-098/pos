import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PurchaseService } from '../core/services/purchase/purchase.service';

@Component({
  selector: 'app-purchase-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css'],
})
export class PurchaseReportComponent implements OnInit {
  purchases: any[] = [];

  // Totals
  totalPurchases = 0;
  totalQty = 0;
  totalAmount = 0;
  totalFinalAmount = 0;
  totalPaidAmount = 0;

  constructor(private purchaseService: PurchaseService, private router: Router) {}

  ngOnInit(): void {
    this.getAllPurchases();
  }

  /** Fetch all purchases */
  getAllPurchases(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (res: any) => {
        console.log('🧾 Purchase data:', res);

        if (Array.isArray(res)) {
          this.purchases = res;
        } else if (res?.data) {
          this.purchases = res.data;
        } else if (res?.purchases) {
          this.purchases = res.purchases;
        } else {
          this.purchases = [];
        }

        // ✅ Convert all numeric fields to safe numbers
        this.purchases = this.purchases.map(p => ({
          ...p,
          quantity: Number(p.quantity) || 0,
          total_amount: Number(p.total_amount) || 0,
          final_amount: Number(p.final_amount) || 0,
          total_paid_amount: Number(p.total_paid_amount) || 0
        }));

        // Calculate totals after conversion
        this.calculateTotals();
      },
      error: (err) => {
        console.error('❌ Error fetching purchases:', err);
      },
    });
  }

  /** Calculate totals */
  calculateTotals(): void {
    this.totalPurchases = this.purchases.length;
    this.totalQty = this.purchases.reduce((sum, p) => sum + p.quantity, 0);
    this.totalAmount = this.purchases.reduce((sum, p) => sum + p.total_amount, 0);
    this.totalFinalAmount = this.purchases.reduce((sum, p) => sum + p.total_paid_amount, 0);
    this.totalPaidAmount = this.purchases.reduce((sum, p) => sum + p.total_paid_amount, 0);
  }
}
