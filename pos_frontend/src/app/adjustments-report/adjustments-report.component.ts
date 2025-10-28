import { Component, OnInit } from '@angular/core';
import { StockAdjustmentsService } from '../core/services/stock_adjustments/stock-adjustements.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adjustments-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adjustments-report.component.html',
  styleUrls: ['./adjustments-report.component.css']
})
export class AdjustmentsReportComponent implements OnInit {
  adjustments: any[] = [];

  // Totals
  totalNormal = 0;
  totalAbnormal = 0;
  totalAdjustments = 0;
  totalRecovered = 0;

  constructor(
    private adjustmentsService: StockAdjustmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllAdjustments();
  }

  /** Get all stock adjustments and calculate totals */
  getAllAdjustments(): void {
    this.adjustmentsService.getAllAdjustments().subscribe({
      next: (res: any) => {
        this.adjustments = Array.isArray(res) ? res : res?.data || [];

        this.calculateTotals();
      },
      error: err => console.error('Error fetching stock adjustments:', err)
    });
  }

  /** Calculate summary totals */
  calculateTotals(): void {
    this.totalNormal = this.adjustments.filter(a => a.adjustment_type === 'normal').length;
    this.totalAbnormal = this.adjustments.filter(a => a.adjustment_type === 'abnormal').length;
    this.totalAdjustments = this.adjustments.length;
    this.totalRecovered = this.adjustments.reduce((sum, a) => sum + (Number(a.recovery_amount) || 0), 0);
  }
}
