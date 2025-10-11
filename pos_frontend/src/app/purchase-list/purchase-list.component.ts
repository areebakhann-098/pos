import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../core/services/purchase/purchase.service';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css'],
})
export class PurchaseListComponent implements OnInit {
  purchases: any[] = [];
  loading = true;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.getPurchases();
  }

  /** ✅ Fetch all purchases from API */
  getPurchases(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.purchases = res.data;
          console.log('✅ Purchases loaded:', this.purchases);
        } else {
          console.warn('⚠️ Invalid data format:', res);
          this.purchases = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching purchases:', err);
        this.loading = false;
      },
    });
  }

  /** 📝 Edit purchase (future feature) */
  onEdit(purchase: any): void {
    alert(`Edit clicked for Reference No: ${purchase.reference_number}`);
  }

  /** 🗑️ Delete purchase */
  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this purchase?')) {
      this.purchaseService.deletePurchase(id).subscribe({
        next: () => {
          this.purchases = this.purchases.filter((p) => p.id !== id);
          alert('✅ Purchase deleted successfully!');
        },
        error: (err) => console.error('❌ Error deleting purchase:', err),
      });
    }
  }
}
