import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface PurchaseItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discountType: 'fixed' | 'percentage';
  discountAmount: number;
  total: number;
}

@Component({
  selector: 'app-add-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-purchases.component.html',
})
export class AddPurchasesComponent {
  // Form fields
  supplier: string = '';
  refNo: string = '';
  purchaseDate: string = '';
  status: string = '';
  location: string = '';
  notes: string = '';
  amountPaid: number = 0;
  datePaid: string = '';
  paymentMethod: string = '';

  // Dummy products list
  products: Product[] = [
    { id: 1, name: 'Laptop', price: 50000 },
    { id: 2, name: 'Mobile', price: 25000 },
    { id: 3, name: 'Headphones', price: 5000},
    { id: 4, name: 'Keyboard', price: 2000 },
  ];

  // Purchase items array
  purchaseItems: PurchaseItem[] = [];
  searchQuery: string = '';

  // Search filter
  get filteredProducts() {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Add product
  addProduct(product: Product) {
    const existing = this.purchaseItems.find((p) => p.id === product.id);

    if (existing) {
      existing.quantity += 1;
      this.calculateTotal(existing);
    } else {
      const newItem: PurchaseItem = {
        id: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        discountType: 'fixed',
        discountAmount: 0,
    
        total: 0,
      };
      this.calculateTotal(newItem);
      this.purchaseItems.push(newItem);
    }

    this.searchQuery = '';
  }

  // Calculate per item total
  calculateTotal(item: PurchaseItem) {
    let subtotal = item.quantity * item.price;

    // discount
    if (item.discountType === 'fixed') {
      subtotal -= item.discountAmount;
    } else if (item.discountType === 'percentage') {
      subtotal -= (subtotal * item.discountAmount) / 100;
    }

    // tax

    item.total = subtotal > 0 ? subtotal : 0;
  }

  // Delete product
  deleteItem(id: number) {
    this.purchaseItems = this.purchaseItems.filter((p) => p.id !== id);
  }

  // Totals
  get totalItems() {
    return this.purchaseItems.reduce((sum, p) => sum + p.quantity, 0);
  }

  get netTotal() {
    return this.purchaseItems.reduce((sum, p) => sum + p.total, 0);
  }

  // Save purchase
  savePurchase() {
    const purchaseData = {
      supplier: this.supplier,
      refNo: this.refNo,
      purchaseDate: this.purchaseDate,
      status: this.status,
      location: this.location,
      notes: this.notes,
      amountPaid: this.amountPaid,
      datePaid: this.datePaid,
      paymentMethod: this.paymentMethod,
      products: this.purchaseItems,
      totalAmount: this.netTotal,
    };

    console.log('Purchase Saved:', purchaseData);
    alert('Purchase saved successfully!');
  }
}
