import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { PurchaseService } from '../core/services/purchase/purchase.service';
import { DiscountService } from '../core/services/discount/discount.service';
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
export class AddPurchasesComponent implements OnInit {
  // 🧾 Form fields
  supplier = '';
  refNo = '';
  purchaseDate = '';
  status = '';
  location = '';
  notes = '';
  amountPaid = 0;
  datePaid = '';
  paymentMethod = '';

  // 🔍 Search & Lists
  searchQuery = '';
  filteredProducts: Product[] = [];
  discounts: Discount[] = [];
  suppliers: any[] = [];
  locations: any[] = [];

  // 💡 For edit mode
  isEditMode = false;
  purchaseId: number | null = null;

  // 🛒 Purchase items
  purchaseItems: PurchaseItem[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    private purchaseService: PurchaseService,
    private discountService: DiscountService,
    private contactService: ContactService,
    private businessLocationService: BusinessLocationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setupSearchListener();
  }

  ngOnInit() {
    this.getAllDiscounts();
    this.getSuppliers();
    this.getBusinessLocations();

    // 🟢 Check if route contains an ID (for edit mode)
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.purchaseId = Number(idParam);
        this.loadPurchaseById(this.purchaseId);
      }
    });
  }

/** 🔹 Load purchase data for editing */
loadPurchaseById(id: number): void {
  this.purchaseService.getPurchaseById(id).subscribe({
    next: (res: any) => {
      const purchase = res.data;
      if (!purchase) return;

      console.log('✅ Full purchase data:', purchase);

      //  Populate form fields
      this.supplier = String(purchase.contact_id);
      this.refNo = purchase.reference_number || '';
      this.purchaseDate = purchase.purchase_date?.split('T')[0] || '';
      this.status = purchase.purchase_status || '';
      this.location = String(purchase.bussiness_location_id);
      this.notes = purchase.additional_notes || '';
      this.amountPaid = Number(purchase.total_paid_amount) || 0;
      this.datePaid = purchase.date_paid_on?.split('T')[0] || '';
      this.paymentMethod = purchase.payment_method || '';

      //  Handle single product (not array)
      const p = purchase.product;
      if (p) {
        const discount = purchase.discount || null;
        const discountAmount = discount
          ? Number(discount.discount_amount)
          : 0;
        const discountName = discount ? discount.discount_type : 'No Discount';
        const displayDiscount = discountAmount
          ? `Rs. ${discountAmount}`
          : '';

        this.purchaseItems = [
          {
            id: p.id,
            name: p.product_name,
            quantity: purchase.quantity || 1,
            price: p.price?.purchase_price || 0,
            discount_id: purchase.discount_id || null,
            discountAmount,
            discountName,
            displayDiscount,
            total: Number(purchase.total_amount) || 0,
          },
        ];
      }

      console.log('Purchase items loaded:', this.purchaseItems);

      // Recalculate line totals to ensure UI updates correctly
      this.purchaseItems.forEach((item) => this.updateLineTotal(item));
    },
    error: (err) => {
      console.error('Error loading purchase:', err);
    },
  });
}


  /**  Setup product search listener */
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

  /**  Discount selection */
  onDiscountSelect(item: PurchaseItem) {
    const selectedDiscount = this.discounts.find((d) => d.id === +(item.discount_id || 0));

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

  /** Quantity changed */
  onQuantityInput(item: PurchaseItem): void {
    this.updateLineTotal(item);
  }

  /** Update total after discount */
  updateLineTotal(item: PurchaseItem): void {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discountAmount) || 0;

    const subtotal = quantity * price;
    const discountValue = (subtotal * discount) / 100;
    const totalAfterDiscount = subtotal - discountValue;

    item.total = totalAfterDiscount > 0 ? totalAfterDiscount : 0;
  }

  /**  Delete product */
  deleteItem(id: number): void {
    this.purchaseItems = this.purchaseItems.filter((p) => p.id !== id);
  }

  /**  Total items */
  get totalItems(): number {
    return this.purchaseItems.length;
  }

  /**  Net total */
  get netTotal(): number {
    return this.purchaseItems.reduce((sum, item) => sum + item.total, 0);
  }

  /**  Save or Update purchase */
  savePurchase(): void {
    if (!this.supplier || !this.refNo || !this.purchaseDate || !this.status || !this.location) {
      alert('Please fill all required fields and add at least one product.');
      return;
    }

const firstItem = this.purchaseItems[0]; 

const payload = {
  contact_id: Number(this.supplier),
reference_number: Number(this.refNo),
  purchase_date: this.purchaseDate,
  purchase_status: this.status,
  bussiness_location_id: Number(this.location),
  additional_notes: this.notes || null,
  total_paid_amount: Number(this.amountPaid),
  date_paid_on: this.datePaid,
  payment_method: this.paymentMethod,

  // ✅ Add single product fields (NOT array)
  product_id: firstItem.id,
  quantity: firstItem.quantity,
  price: firstItem.price,
  discount_id: firstItem.discount_id || null,
  total_amount: firstItem.total,
};


    if (this.isEditMode && this.purchaseId) {
      //  UPDATE
      this.purchaseService.updatePurchase(this.purchaseId, payload).subscribe({
        next: () => {
          alert(' Purchase updated successfully!');
          this.router.navigate(['/home/Purchase_list']);
        },
        error: (err) => {
          console.error('❌ Error updating purchase:', err);
        },
      });
    } else {
      // ➕ CREATE
      this.purchaseService.createPurchase(payload).subscribe({
        next: () => {
          alert('✅ Purchase created successfully!');
          this.resetForm();
          this.router.navigate(['/home/Purchase_list']);
        },
        error: (err) => {
          console.error('❌ Error creating purchase:', err);
        },
      });
    }
  }

  /**  Reset form */
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

  /**  Fetch locations */
  getBusinessLocations() {
    this.businessLocationService.getAllLocations().subscribe({
      next: (res: any) => {
        const data = res.data || res.locations;
        if (res.success && Array.isArray(data)) {
          this.locations = data.map((loc: any) => ({ id: loc.id, name: loc.name }));
        }
      },
      error: (err) => console.error('❌ Error fetching business locations:', err),
    });
  }

  /** 👥 Fetch suppliers */
  getSuppliers() {
    this.contactService.getContacts().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.suppliers = res.data
            .filter((c: any) => c.contact_type === 'Supplier')
            .map((c: any) => ({
              id: c.id,
              name: [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(' '),
            }));
        }
      },
      error: (err) => console.error('❌ Error fetching suppliers:', err),
    });
  }

  /** 🎟 Fetch discounts */
  getAllDiscounts() {
    this.discountService.getDiscounts().subscribe({
      next: (res: any) => {
        this.discounts = Array.isArray(res.data) ? res.data : [];
      },
      error: (err) => console.error('❌ Error fetching discounts:', err),
    });
  }
}
