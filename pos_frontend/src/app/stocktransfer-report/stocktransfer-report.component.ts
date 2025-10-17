import { Component } from '@angular/core';
import { StockTransferService } from '../core/services/stock_transfer/stock-transfer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stocktransfer-report',
  imports: [CommonModule],
  templateUrl: './stocktransfer-report.component.html',
  styleUrl: './stocktransfer-report.component.css'
})
export class StocktransferReportComponent {
  stockTransfers: any[] = [];

  // ✅ Totals
  totalQty = 0;
  totalShipment = 0;
  totalAmount = 0;

  constructor(private stockTransferService: StockTransferService) {}

  ngOnInit(): void {
    this.getAllTransfers();
  }

  /** ✅ Fetch All Stock Transfers */
  getAllTransfers(): void {
    this.stockTransferService.getStockTransfers().subscribe({
      next: (res: any) => {
        console.log('📦 Stock Transfers:', res);
        this.stockTransfers = Array.isArray(res) ? res : res?.data || [];

        // ✅ Normalize and compute values
        this.stockTransfers = this.stockTransfers.map((t: any) => ({
          ...t,
          quantity: Number(t.quantity) || 0,
          shipment_charges: Number(t.shipment_charges) || 0,
          total_amount:
            Number(t.total_amount) ||
            (Number(t.quantity) * (t.product?.price || 0)) +
              Number(t.shipment_charges)
        }));

        this.calculateTotals();
      },
      error: (err) => console.error('❌ Error fetching stock transfers:', err)
    });
  }

  /** ✅ Calculate Totals */
  calculateTotals(): void {
    this.totalQty = this.stockTransfers.reduce((sum, t) => sum + t.quantity, 0);
    this.totalShipment = this.stockTransfers.reduce(
      (sum, t) => sum + t.shipment_charges,
      0
    );
    this.totalAmount = this.stockTransfers.reduce(
      (sum, t) => sum + t.total_amount,
      0
    );
  }
}