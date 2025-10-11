import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../core/services/purchase/purchase.service';
import { DiscountService } from '../core/services/discount/discount.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContactService } from '../core/services/contact/contact.service';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';

interface Product {
  id: number;
  product_name?: string;
  price?: { purchase_price?: number };
  quantity?: number;
}

interface Discount {
  id: number;
  name: string;
  discount_amount: number;
}

interface PurchaseItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discountName?: string;
  discountAmount: number;
  total: number;
  selectedDiscount?: Discount | null;
  discount_id?: number;
  displayDiscount?: string;
}

@Component({
  selector: 'app-add-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-purchases.component.html',
})
export class AddPurchasesComponent {
  supplier = '';
  refNo = '';
  purchaseDate = '';
  status = '';
  location = '';
  notes = '';
  amountPaid = 0;
  datePaid = '';
  paymentMethod = '';

  searchQuery = '';
  filteredProducts: Product[] = [];
  discounts: Discount[] = [];
suppliers: any[] = [];
locations: any[] = [];

  private searchSubject = new Subject<string>();
  purchaseItems: PurchaseItem[] = [];

  constructor(
    private purchaseService: PurchaseService,
    private discountService: DiscountService,
      private contactService: ContactService,
        private businessLocationService: BusinessLocationService 


  ) {
    this.setupSearchListener();
  }

  ngOnInit() {
    this.getAllDiscounts();
      this.getSuppliers(); 
      this.getBusinessLocations(); 


  }
getBusinessLocations() {
  this.businessLocationService.getAllLocations().subscribe({
    next: (res: any) => {
      console.log("📦 Raw Location API Response:", res);
      
      // ✅ Adjust key to match backend
      const data = res.data || res.locations;  

      if (res.success && Array.isArray(data)) {
        this.locations = data.map((loc: any) => ({
          id: loc.id,
          name: loc.name
        }));
      }

      console.log("✅ Final Locations Array:", this.locations);
    },
    error: (err) => console.error('❌ Error fetching business locations:', err),
  });
}



  getSuppliers() {
  this.contactService.getContacts().subscribe({
    next: (res: any) => {
      if (res.success && Array.isArray(res.data)) {
        // ✅ Filter only suppliers
        this.suppliers = res.data
          .filter((c: any) => c.contact_type === 'Supplier')
          .map((c: any) => ({
            id: c.id,
            name: [c.first_name, c.middle_name, c.last_name]
              .filter(Boolean) // remove null/undefined
              .join(' '),
          }));
        console.log('✅ Suppliers:', this.suppliers);
      }
    },
    error: (err) => {
      console.error('❌ Error fetching suppliers:', err);
    },
  });
}


  /** 🔍 Setup product search listener */
  private setupSearchListener(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((q: string) => {
        const query = q.trim().toLowerCase();
        if (!query) {
          this.filteredProducts = [];
          return;
        }

        this.purchaseService.searchProducts(query).subscribe({
          next: (res: any) => {
            const products: Product[] = Array.isArray(res?.data) ? res.data : [];
            this.filteredProducts = products;
          },
          error: (err) => {
            console.error('❌ Error fetching products:', err);
            this.filteredProducts = [];
          },
        });
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  /** ➕ Add product */
  addProduct(product: Product): void {
    const existing = this.purchaseItems.find((p) => p.id === product.id);
    const purchasePrice = product.price?.purchase_price || 0;

    if (existing) {
      existing.quantity += 1;
      this.updateLineTotal(existing);
    } else {
      const newItem: PurchaseItem = {
        id: product.id,
        name: product.product_name || 'Unnamed Product',
        price: purchasePrice,
        quantity: 1,
        discountName: 'No Discount',
        discountAmount: 0,
        total: 0,
        selectedDiscount: null,
      };
      this.updateLineTotal(newItem);
      this.purchaseItems.push(newItem);
    }

    this.searchQuery = '';
    this.filteredProducts = [];
  }

  /** 🧾 Discount selection */
  onDiscountSelect(item: PurchaseItem) {
   const selectedDiscount = this.discounts.find(
    (d) => d.id === +(item.discount_id || 0)
  );

    if (selectedDiscount) {
      item.discountName = selectedDiscount.name;
      item.discountAmount = Number(selectedDiscount.discount_amount) || 0;
      item.displayDiscount = `Rs. ${selectedDiscount.discount_amount}`;
    } else {
      item.discountName = 'No Discount';
      item.discountAmount = 0;
      item.displayDiscount = '';
    }

    this.updateLineTotal(item);
  }

onQuantityInput(item: PurchaseItem): void {
  console.log("🟡 Quantity field changed for:", item.name);
  console.log("➡️ New Quantity:", item.quantity);
  this.updateLineTotal(item);
}

updateLineTotal(item: PurchaseItem): void {
  const quantity = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const discount = Number(item.discountAmount) || 0;

  // 🧮 Step 1: Calculate subtotal
  const subtotal = quantity * price;

  // 🧮 Step 2: Calculate discount as a percentage
  const discountValue = (subtotal * discount) / 100;

  // 🧮 Step 3: Apply discount
  const totalAfterDiscount = subtotal - discountValue;

  // 🧮 Step 4: Ensure final total is never negative
  item.total = totalAfterDiscount > 0 ? totalAfterDiscount : 0;


}



  /** 🗑️ Delete product row */
  deleteItem(id: number): void {
    this.purchaseItems = this.purchaseItems.filter((p) => p.id !== id);
  }

  /** 📦 Total items */
get totalItems(): number {
  return this.purchaseItems.length;
}

  /** 💵 Net total */
  get netTotal(): number {
    return this.purchaseItems.reduce((sum, item) => sum + item.total, 0);
  }
savePurchase(): void {
  if (
    !this.supplier ||
    !this.refNo ||
    !this.purchaseDate ||
    !this.status ||
    !this.location ||
    this.purchaseItems.length === 0
  ) {
    alert('Please fill all required fields and add at least one product.');
    return;
  }

  // 🧮 Calculate total quantity
  const totalQuantity = this.purchaseItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
const payload = {
  contact_id: Number(this.supplier),
  discount_id: Number(this.purchaseItems[0]?.discount_id) || null, 
  reference_number: this.refNo,
  purchase_date: this.purchaseDate,
  purchase_status: this.status,
  bussiness_location_id: Number(this.location),
  additional_notes: this.notes || null,
  total_paid_amount: Number(this.amountPaid),
  date_paid_on: this.datePaid,
  payment_method: this.paymentMethod,
  products: this.purchaseItems.map((item) => ({
    product_id: Number(item.id), 
    quantity: Number(item.quantity),
    total_amount: Number(item.total),
  })),
};

  console.log('📦 Final Payload Sent:', payload);

  // 🚀 Send full payload once
  this.purchaseService.createPurchase(payload).subscribe({
    next: (res: any) => {
      console.log('✅ Purchase saved successfully:', res);
      alert('✅ Purchase saved successfully!');
      this.resetForm();
    },
    error: (err) => {
      console.error('❌ Error saving purchase:', err);
      alert('❌ Failed to save purchase. Check console for details.');
    },
  });
}



  /** 🔄 Reset form */
  private resetForm(): void {
    this.purchaseItems = [];
    this.supplier = '';
    this.refNo = '';
    this.purchaseDate = '';
    this.status = '';
    this.location = '';
    this.notes = '';
    this.amountPaid = 0;
    this.datePaid = '';
    this.paymentMethod = '';
  }

  /** 🏷️ Fetch all discounts */
  getAllDiscounts() {
    this.discountService.getDiscounts().subscribe({
      next: (res: any) => {
        this.discounts = Array.isArray(res.data) ? res.data : [];
        console.log('✅ Discounts:', this.discounts);
      },
      error: (err) => {
        console.error('❌ Error fetching discounts:', err);
      },
    });
  }
}
