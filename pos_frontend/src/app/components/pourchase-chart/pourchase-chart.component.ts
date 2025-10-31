import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexGrid
} from 'ng-apexcharts';
import { PurchaseService } from '../../core/services/purchase/purchase.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};

@Component({
  selector: 'app-pourchase-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './pourchase-chart.component.html',
  styleUrls: ['./pourchase-chart.component.css'],
})
export class PourchaseChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  purchases: any[] = [];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.getDailyPurchases();
  }

  /**  Fetch all purchases from API */
  getDailyPurchases() {
    this.purchaseService.getPurchases().subscribe({
      next: (res: any) => {
        this.purchases = Array.isArray(res) ? res : res?.data || [];
        const dailyTotals = this.calculateDailyPurchases(this.purchases);
        this.initializeChart(dailyTotals);
      },
      error: (err) => {
        console.error(' Error fetching purchases:', err);
      },
    });
  }

  /**  Calculate daily purchase totals and round to integers */
  calculateDailyPurchases(purchases: any[]) {
    const dailyMap: { [key: string]: number } = {};

    for (let purchase of purchases) {
      const date = new Date(purchase.purchase_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const amount = Math.round(purchase.total_paid_amount || 0);
      dailyMap[date] = (dailyMap[date] || 0) + amount;
    }

    const labels = Object.keys(dailyMap);
    const values = Object.values(dailyMap).map(v => Math.round(v));
    return { labels, values };
  }

  /** 🔹 Initialize chart */
  initializeChart(dailyTotals: { labels: string[]; values: number[] }) {
    this.chartOptions = {
      series: [
        {
          name: 'Daily Purchases',
          data: dailyTotals.values,
        },
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Daily Purchase Overview',
        align: 'left',
      },
      grid: {
        borderColor: '#f1f1f1',
        row: {
          colors: ['#f9f9f9', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: dailyTotals.labels,
      },
    };
  }
}
