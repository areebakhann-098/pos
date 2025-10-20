import { Component, ViewChild, OnInit } from '@angular/core';
import { PourchaseChartComponent } from '../components/pourchase-chart/pourchase-chart.component';
import { SaleChartComponent } from "../components/sale-chart/sale-chart.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PourchaseChartComponent, SaleChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent  {
 
}
