import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  name: string;
  sku: string;
  price: number;
  qty: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos.component.html'
})
export class PosComponent {
  today = new Date();

  // Products list (Right Side)
  products: Product[] = [
    { name: 'Milk', sku: '#123', price: 100, qty: 1 },
    { name: 'Peshawari Chappal', sku: '#16041', price: 1200, qty: 1 },
    { name: 'Charsadda Chappal', sku: '#16037', price: 1500, qty: 1 },
    { name: 'Brianna Moon', sku: 'Food', price: 500, qty: 1 }
  ];

  // Added products (Left Side)
  cart: Product[] = [];

  // Add to cart
  addToCart(product: Product) {
    const existing = this.cart.find(p => p.sku === product.sku);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({ ...product });
    }
  }

  // Remove from cart
  removeFromCart(sku: string) {
    this.cart = this.cart.filter(p => p.sku !== sku);
  }

  // Totals
  get totalItems(): number {
    return this.cart.reduce((sum, p) => sum + p.qty, 0);
  }

  get totalPrice(): number {
    return this.cart.reduce((sum, p) => sum + p.qty * p.price, 0);
  }
}
