import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/services/product/product.service';
import { DiscountService } from '../core/services/discount/discount.service';
import { TaxRateService } from '../core/services/tax_rate/tax-rate.service';
import { SaleService } from '../core/services/sale/sale.service'; 
import { BusinessLocationService } from '../core/services/business_location/business-location.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Product {
  id: number;
  product_name: string;
  price: number;
  qty: number;
  brand?: { name: string };
  Category?: { name: string };
}

interface Discount {
  id: number;
  name: string;
  discount_type: string;
  discount_amount: string;
}

interface TaxRate {
  id: number;
  name: string;
  amount: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
})
export class PosComponent implements OnInit {
  today = new Date();

  products: Product[] = [];
  cart: Product[] = [];

  selectedCategory: string = 'All Categories';

  discounts: Discount[] = [];
  selectedDiscountId: number | null = null;
  selectedDiscount: Discount | null = null;

  taxRates: TaxRate[] = [];
  selectedTaxId: number | null = null;
  selectedTax: TaxRate | null = null;

  subtotal: number = 0;
  discountAppliedAmount: number = 0;
  totalAfterDiscount: number = 0;
  taxAppliedAmount: number = 0;
  totalAfterTax: number = 0;
  businessLocations: any[] = [];
  selectedBusinessLocationId: number | null = null;

  constructor(
    private productService: ProductService,
    private discountService: DiscountService,
    private taxRateService: TaxRateService,
    private saleService: SaleService,
    private businessLocationService: BusinessLocationService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllDiscounts();
    this.getAllTaxRates();
    this.getAllBusinessLocations();
  }
  getAllBusinessLocations(): void {
    this.businessLocationService.getAllLocations().subscribe({
      next: (res: any) => {
        // Some endpoints return `res.businessLocations`, others `res.locations`
        this.businessLocations = res.businessLocations || res.locations || [];
        console.log('📍 Locations fetched in POS:', this.businessLocations);
      },
      error: (err) => console.error('❌ Error fetching locations:', err),
    });
  }

  onLocationChange() {
    const selected = this.businessLocations.find(
      (loc) => loc.id === this.selectedBusinessLocationId
    );
    if (selected) {
      console.log('📍 Selected Location:', selected.name, '| ID:', selected.id);
    }
  }

  // ✅ Fetch products
  getAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data.map((p: any) => ({
          id: p.id,
          product_name: p.product_name,
          price: p.price?.sell_price || 0,
          qty: 1,
          brand: p.brand,
          Category: p.Category,
        }));
      },
      error: (err) => console.error(err),
    });
  }

  getAllDiscounts(): void {
    this.discountService.getDiscounts().subscribe({
      next: (res) => (this.discounts = res.data),
      error: (err) => console.error(err),
    });
  }

  getAllTaxRates(): void {
    this.taxRateService.getAllTaxRates().subscribe({
      next: (res) => (this.taxRates = res.data),
      error: (err) => console.error(err),
    });
  }

  addToCart(product: Product) {
    const existing = this.cart.find((p) => p.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({ ...product });
    }
    this.calculateTotal();
  }

  removeFromCart(id: number) {
    this.cart = this.cart.filter((p) => p.id !== id);
    this.calculateTotal();
  }

  get totalItems(): number {
    return this.cart.reduce((sum, p) => sum + p.qty, 0);
  }

  onDiscountChange() {
    this.selectedDiscount =
      this.discounts.find((d) => d.id === this.selectedDiscountId) || null;
    this.calculateTotal();
  }

  onTaxChange() {
    this.selectedTax =
      this.taxRates.find((t) => t.id === this.selectedTaxId) || null;
    this.calculateTotal();
  }

calculateTotal() {
  this.subtotal = this.cart.reduce((sum, p) => sum + p.qty * p.price, 0);

  if (this.selectedDiscount) {
    if (this.selectedDiscount.discount_type === 'percentage') {
      this.discountAppliedAmount =
        (this.subtotal * +this.selectedDiscount.discount_amount) / 100;
    } else {
      this.discountAppliedAmount = +this.selectedDiscount.discount_amount;
    }
  } else {
    this.discountAppliedAmount = 0;
  }

  this.totalAfterDiscount = this.subtotal - this.discountAppliedAmount;

  if (this.selectedTax) {
    this.taxAppliedAmount =
      (this.totalAfterDiscount * this.selectedTax.amount) / 100;
  } else {
    this.taxAppliedAmount = 0;
  }

  this.totalAfterTax = this.totalAfterDiscount + this.taxAppliedAmount;

  // ✅ Round to 2 decimal places (fixed)
  this.subtotal = +this.subtotal.toFixed(2);
  this.discountAppliedAmount = +this.discountAppliedAmount.toFixed(2);
  this.totalAfterDiscount = +this.totalAfterDiscount.toFixed(2);
  this.taxAppliedAmount = +this.taxAppliedAmount.toFixed(2);
  this.totalAfterTax = +this.totalAfterTax.toFixed(2);
}


  // ✅ Save Sale when Cash button is clicked
  createSale() {
    if (this.cart.length === 0) {
      alert('No products in cart!');
      return;
    }

    const salePayload = {
      sale_date: new Date(),
      business_location_id: this.selectedBusinessLocationId,
      total_items: this.totalItems,
      total_amount: this.subtotal,
      discount_id: this.selectedDiscount?.id || null,
      tax_id: this.selectedTax?.id || null,
      final_amount: this.totalAfterTax,
      payment_method: 'cash',
      amount_paid: this.totalAfterTax,
      products: this.cart.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
      })),
    };

    console.log('🟢 Sale Payload:', salePayload);

    this.saleService.createSale(salePayload).subscribe({
      next: (res) => {
        console.log('✅ Sale saved:', res);
        alert('Sale completed successfully!');

        // ✅ Generate receipt PDF
        this.generateSaleReport(res.data || salePayload);

        this.cart = [];
        this.selectedDiscountId = null;
        this.selectedTaxId = null;
        this.calculateTotal();
      },
       error: (err) => {
      console.error('❌ Error saving sale:', err);

      // 🔹 Extract backend error message if available
      const errorMessage =
        err?.error?.error || 'Error creating sale. Please try again!';
      
      alert(errorMessage); // Show it to the user
    },
  });
  }
  generateSaleReport(sale: any) {
  const selectedLocation = this.businessLocations.find(
    (b) => b.id === this.selectedBusinessLocationId
  );

  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 200], 
  });

  // 🔹 Header: Business Info
  doc.setFontSize(10);
  doc.text(selectedLocation?.name || 'Business Name', 40, 8, { align: 'center' });
  doc.setFontSize(8);
  doc.text(
    `${selectedLocation?.landmark || ''}, ${selectedLocation?.city || ''}`,
    40,
    12,
    { align: 'center' }
  );
  doc.text(
    `Ph: ${selectedLocation?.mobile || ''}`,
    40,
    16,
    { align: 'center' }
  );
  doc.text(
    `Email: ${selectedLocation?.email || ''}`,
    40,
    20,
    { align: 'center' }
  );

  doc.line(5, 23, 75, 23);

  doc.setFontSize(8);
  doc.text(`Date: ${new Date().toLocaleString()}`, 5, 27);
  doc.text(`Invoice #: ${sale.id || 'N/A'}`, 60, 27);

  doc.setFontSize(8);
  let y = 32;
  doc.text('Item', 5, y);
  doc.text('Qty', 35, y);
  doc.text('Rate', 45, y);
  doc.text('Total', 65, y);
  doc.line(5, y + 1, 75, y + 1);

  y += 5;
  this.cart.forEach((item) => {
    doc.text(item.product_name.substring(0, 15), 5, y);
    doc.text(String(item.qty), 35, y); 
    doc.text(item.price.toFixed(2), 55, y, { align: 'right' }); 
    doc.text((item.qty * item.price).toFixed(2), 75, y, { align: 'right' }); 
    y += 5;
  });

  doc.line(5, y - 2, 75, y - 2);

  y += 3;
  doc.text(`Subtotal: Rs. ${this.subtotal.toFixed(2)}`, 5, y);
  y += 4;
  if (this.selectedDiscount) {
    doc.text(
      `Discount (${this.selectedDiscount.name}): -Rs. ${this.discountAppliedAmount.toFixed(2)}`,
      5,
      y
    );
    y += 4;
  }
  if (this.selectedTax) {
    doc.text(
      `Tax (${this.selectedTax.name}): +Rs. ${this.taxAppliedAmount.toFixed(2)}`,
      5,
      y
    );
    y += 4;
  }

  doc.setFontSize(9);
  doc.text(`Total Payable: Rs. ${this.totalAfterTax.toFixed(2)}`, 5, y);
  y += 6;

  doc.setFontSize(8);
  doc.text(`Payment Method: Cash`, 5, y);
  y += 8;

  doc.setFontSize(8);
  doc.text('Thank you for shopping with us!', 40, y, { align: 'center' });
  y += 4;
  doc.text('Powered by Areeba/Usman POS System', 40, y, { align: 'center' });

  doc.output('dataurlnewwindow');
}


  get uniqueCategories(): string[] {
    return Array.from(
      new Set(
        this.products
          .map((p) => p.Category?.name)
          .filter((name): name is string => !!name)
      )
    );
  }

  get filteredProducts(): Product[] {
    if (this.selectedCategory === 'All Categories') return this.products;
    return this.products.filter(
      (p) => p.Category?.name === this.selectedCategory
    );
  }
}
