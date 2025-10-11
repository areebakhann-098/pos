import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface TransferItem {
  product: Product | null;
  quantity: number;
  price: number;
  lineTotal: number;
}

@Component({
  selector: 'app-stock-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.css'],
})
export class StockTransferComponent {
  // Dummy Products
  products: Product[] = [
    { id: 1, name: 'Laptop', price: 80000 },
    { id: 2, name: 'Mobile', price: 40000 },
    { id: 3, name: 'Headphones', price: 5000 },
    { id: 4, name: 'Keyboard', price: 3000 },
    { id: 5, name: 'Mouse', price: 1500 },
  ];

  searchTerm: string = '';
  items: TransferItem[] = [];
  shippingCharges: number = 0;

  // ➝ Filtered products for search
  get filteredProducts() {
    if (!this.searchTerm) return [];
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ➝ Add Product to Table (when selected from search)
  addProduct(product: Product) {
    const newItem: TransferItem = {
      product: product,
      quantity: 1,
      price: product.price,
      lineTotal: product.price,
    };
    this.items.push(newItem);

    // reset search after selection
    this.searchTerm = '';
  }

  // ➝ Update Line Total
  updateLineTotal(item: TransferItem) {
    item.lineTotal = item.quantity * item.price;
  }

  // ➝ Remove Row
  removeRow(index: number) {
    this.items.splice(index, 1);
  }

  // ➝ Total Amount
  get totalAmount() {
    return (
      this.items.reduce((sum, i) => sum + i.lineTotal, 0) +
      (this.shippingCharges || 0)
    );
  }

  // ➝ Save Form
  saveTransfer() {
    console.log('Stock Transfer Data:', {
      items: this.items,
      shippingCharges: this.shippingCharges,
      total: this.totalAmount,
    });
    alert('Stock Transfer Saved ✅');
  }
}
