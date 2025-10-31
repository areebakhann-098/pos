import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockTransferService } from '../core/services/stock_transfer/stock-transfer.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-stocktransfer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stocktransfer-list.component.html',
  styleUrls: ['./stocktransfer-list.component.css'],
})
export class StocktransferListComponent implements OnInit {
  stockTransfers: any[] = [];

  constructor(
    private stockTransferService: StockTransferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTransfers();
  }

  getAllTransfers(): void {
    this.stockTransferService.getStockTransfers().subscribe({
      next: (res: any) => {
        this.stockTransfers = Array.isArray(res)
          ? res
          : res?.data || [];
      },
      error: (err) => {
        console.error(' Error fetching stock transfers:', err);
      },
    });
  }

  onEdit(transfer: any): void {
    this.router.navigate(['/home/stocktransfer/edit', transfer.id]);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this stock transfer?')) {
      this.stockTransferService.deleteStockTransfer(id).subscribe({
        next: () => {
          alert('🗑️ Stock transfer deleted successfully!');
          this.getAllTransfers();
        },
        error: (err) => {
          console.error(' Error deleting transfer:', err);
          alert('Failed to delete stock transfer!');
        },
      });
    }
  }
}
