import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../core/services/purchase/purchase.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css'],
})
export class PurchaseListComponent implements OnInit {
  purchases: any[] = [];
  loading = true;

  constructor(private purchaseService: PurchaseService,  private router: Router) {}

  ngOnInit(): void {
    this.getPurchases();
  }

  /** ✅ Get all purchases */
  getPurchases(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.purchases = res.data;
        } else {
          console.warn('⚠️ Invalid response format:', res);
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

  onEdit(purchase: any): void {
    // 👇 Navigate with ID
    this.router.navigate(['/home/Purchases/edit', purchase.id]);
  }

  /** 🗑️ Delete Purchase */
  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this purchase?')) {
      this.purchaseService.deletePurchase(id).subscribe({
        next: () => {
          this.purchases = this.purchases.filter((p) => p.id !== id);
          alert('✅ Purchase deleted successfully!');
        },
        error: (err) => {
          console.error('❌ Error deleting purchase:', err);
        },
      });
    }
  }
}
