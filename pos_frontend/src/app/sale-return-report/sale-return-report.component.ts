import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReturnService } from '../core/services/sale_return/sale-return.service';

@Component({
  selector: 'app-sale-return-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-return-report.component.html',
  styleUrls: ['./sale-return-report.component.css'],
})
export class SaleReturnReportComponent implements OnInit {
  saleReturns: any[] = [];
  loading = false;

  constructor(private saleReturnService: SaleReturnService) {}

  ngOnInit(): void {
    this.fetchSaleReturns();
  }

  /** Fetch all sale return records from backend */
  fetchSaleReturns() {
    this.loading = true;
    this.saleReturnService.getAllSaleReturns().subscribe({
      next: (res) => {
        this.saleReturns = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching sale return report:', err);
        this.loading = false;
      },
    });
  }

  /** ✅ Calculate total refund amount safely */
  get totalRefundAmount(): number {
    return this.saleReturns.reduce(
      (sum, r) => sum + (r.total_refund_amount || 0),
      0
    );
  }

  /** ✅ Calculate total returned items count (based on quantity) */
  get totalReturnedItems(): number {
    return this.saleReturns.reduce((count, r) => {
      if (r.returnItems?.length) {
        const itemCount = r.returnItems.reduce(
          (subCount: number, item: any) => subCount + (item.quantity || 0),
          0
        );
        return count + itemCount;
      }
      return count;
    }, 0);
  }
}
