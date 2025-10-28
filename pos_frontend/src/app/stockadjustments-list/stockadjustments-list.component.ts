import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockAdjustmentsService } from '../core/services/stock_adjustments/stock-adjustements.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-stockadjustments-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stockadjustments-list.component.html',
  styleUrls: ['./stockadjustments-list.component.css']
})
export class StockadjustmentsListComponent implements OnInit {
  adjustments: any[] = [];

  constructor(
    private adjustmentsService: StockAdjustmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllAdjustments();
  }

  /** Get all stock adjustments */
  getAllAdjustments(): void {
    this.adjustmentsService.getAllAdjustments().subscribe({
      next: (res: any) => {
        this.adjustments = Array.isArray(res) ? res : res?.data || [];
      
      },
      error: err => console.error('Error fetching stock adjustments:', err)
    });
  }

  /** Edit Adjustment */
  onEdit(adjustment: any): void {
    this.router.navigate(['/home/stockadjustments/edit', adjustment.id]);
  }

  /** Delete Adjustment */
  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this adjustment?')) return;

    this.adjustmentsService.deleteAdjustment(id).subscribe({
      next: () => {
        alert('Adjustment deleted successfully!');
        this.getAllAdjustments();
      },
      error: err => {
        console.error('Error deleting adjustment:', err);
        alert('Failed to delete adjustment!');
      }
    });
  }
}
