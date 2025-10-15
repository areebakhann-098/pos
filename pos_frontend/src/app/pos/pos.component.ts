import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/services/product/product.service';
import { DiscountService } from '../core/services/discount/discount.service';
import { TaxRateService } from '../core/services/tax_rate/tax-rate.service';
import { SaleService } from '../core/services/sale/sale.service'; // ✅ import service

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

  constructor(
    private productService: ProductService,
    private discountService: DiscountService,
    private taxRateService: TaxRateService,
    private saleService: SaleService // ✅ Inject SaleService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllDiscounts();
    this.getAllTaxRates();
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
  }

  // ✅ Save Sale when Cash button is clicked
  createSale() {
    if (this.cart.length === 0) {
      alert('No products in cart!');
      return;
    }

    const salePayload = {
      sale_date: new Date(),
      business_location_id: 1, // ✅ static for now
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
        this.cart = []; // 🧹 Clear cart
        this.selectedDiscountId = null;
        this.selectedTaxId = null;
        this.calculateTotal();
      },
      error: (err) => {
        console.error('❌ Error saving sale:', err);
        alert('Error creating sale!');
      },
    });
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
