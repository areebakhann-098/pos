import { Component, ViewChild, OnInit } from '@angular/core';
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
import { SaleService } from '../../core/services/sale/sale.service';

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
  selector: 'app-sale-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './sale-chart.component.html',
  styleUrls: ['./sale-chart.component.css'],
})
export class SaleChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  sales: any[] = [];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.getDailySales();
  }

  getDailySales() {
    this.saleService.getAllSales().subscribe({
      next: (res: any) => {
        this.sales = Array.isArray(res) ? res : res?.data || [];
        const dailyTotals = this.calculateDailySales(this.sales);
        this.initializeChart(dailyTotals);
      },
      error: (err) => {
        console.error(' Error fetching sales:', err);
      },
    });
  }

  calculateDailySales(sales: any[]) {
    const dailyMap: { [key: string]: number } = {};

    for (let sale of sales) {
      const date = new Date(sale.sale_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const amount = Math.round(sale.final_amount || 0); 
      dailyMap[date] = (dailyMap[date] || 0) + amount;
    }

    const labels = Object.keys(dailyMap);
    const values = Object.values(dailyMap).map(v => Math.round(v));
    return { labels, values };
  }

  initializeChart(dailyTotals: { labels: string[]; values: number[] }) {
    this.chartOptions = {
      series: [
        {
          name: 'Daily Sales',
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
        text: 'Daily Sales Overview',
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
