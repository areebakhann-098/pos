import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SaleService } from '../core/services/sale/sale.service';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-productsell-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productsell-report.component.html',
  styleUrls: ['./productsell-report.component.css'],
})
export class ProductsellReportComponent {
  sales: any[] = [];
  businessLocations: any[] = [];
  expandedIndex: number | null = null;

  // 🔹 Totals
  totalSalesCount = 0;
  totalItemsCount = 0;
  totalAmount = 0;
  totalFinalAmount = 0;
  totalPaidAmount = 0;

  constructor(
    private saleService: SaleService,
    private router: Router,
    private businessLocationService: BusinessLocationService
  ) {}

  ngOnInit(): void {
    this.getAllSales();
    this.getAllBusinessLocations();
  }

  
getAllBusinessLocations(): void {
  this.businessLocationService.getAllLocations().subscribe({
    next: (res: any) => {
      this.businessLocations = res.locations || res.businessLocations || [];

      console.log(' Locations fetched in Report:', this.businessLocations);
    },
    error: (err) => {
      console.error(' Error fetching locations:', err);
    },
  });
}


  toggleSaleDetails(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  getAllSales() {
    this.saleService.getAllSales().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.sales = res;
        } else if (res?.data) {
          this.sales = res.data;
        } else {
          this.sales = [];
        }

        this.calculateTotals();
      },
      error: (err) => {
        console.error(' Error fetching sales:', err);
      },
    });
  }

  calculateTotals() {
    this.totalSalesCount = this.sales.length;
    this.totalItemsCount = this.sales.reduce((sum, s) => sum + (s.total_items || 0), 0);
    this.totalAmount = this.sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    this.totalFinalAmount = this.sales.reduce((sum, s) => sum + (s.final_amount || 0), 0);
    this.totalPaidAmount = this.sales.reduce((sum, s) => sum + (s.amount_paid || 0), 0);
  }

  generateSaleReport(sale: any) {
    const selectedLocation = this.businessLocations.find(
      (b) => b.id === sale.business_location_id
    );

    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200], 
    });

    doc.setFontSize(10);
    doc.text(selectedLocation?.name || 'Business Name', 40, 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text(
      `${selectedLocation?.landmark || ''}, ${selectedLocation?.city || ''}`,
      40,
      12,
      { align: 'center' }
    );
    doc.text(`Phone: ${selectedLocation?.mobile || 'N/A'}`, 40, 16, { align: 'center' });
    doc.text(`Email: ${selectedLocation?.email || 'N/A'}`, 40, 20, { align: 'center' });
    doc.line(5, 23, 75, 23);

    doc.text(`Date: ${new Date(sale.sale_date).toLocaleString()}`, 5, 27);
    doc.text(`Invoice #: ${sale.id || 'N/A'}`, 60, 27);

    doc.setFontSize(8);
    let y = 32;
    doc.text('Item', 5, y);
    doc.text('Qty', 35, y);
    doc.text('Rate', 45, y);
    doc.text('Total', 65, y);
    doc.line(5, y + 1, 75, y + 1);

    y += 5;
    (sale.saleItems || []).forEach((item: any) => {
      const name = item.product?.product_name || '—';
      const qty = item.quantity || 0;
      const price = item.price || 0;
      const total = qty * price;

      doc.text(name.substring(0, 15), 5, y);
      doc.text(String(qty), 35, y);
      doc.text(price.toFixed(2), 55, y, { align: 'right' });
      doc.text(total.toFixed(2), 75, y, { align: 'right' });
      y += 5;
    });

    doc.line(5, y - 2, 75, y - 2);

    y += 3;
    doc.text(`Subtotal: Rs. ${sale.total_amount.toFixed(2)}`, 5, y);
    y += 4;

    if (sale.saleDiscount?.name) {
      doc.text(`Discount (${sale.saleDiscount.name})`, 5, y);
      y += 4;
    }
    if (sale.saleTax?.name) {
      doc.text(`Tax (${sale.saleTax.name})`, 5, y);
      y += 4;
    }

    doc.setFontSize(9);
    doc.text(`Total Payable: Rs. ${sale.final_amount.toFixed(2)}`, 5, y);
    y += 6;

    doc.setFontSize(8);
    doc.text(`Payment Method: ${sale.payment_method || 'Cash'}`, 5, y);
    y += 8;

    doc.text('Thank you for shopping with us!', 40, y, { align: 'center' });
    y += 4;
    doc.text('Powered by Areeba/Usman POS System', 40, y, { align: 'center' });

    doc.output('dataurlnewwindow');
  }
}
