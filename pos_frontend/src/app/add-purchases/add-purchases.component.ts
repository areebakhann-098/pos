import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  //  Form fields
  supplier = '';
  refNo = '';
  purchaseDate = '';
  status = '';
  location = '';
  notes = '';
  amountPaid = 0;
  datePaid = '';
  paymentMethod = '';

  //  Search & Lists
  searchQuery = '';
  filteredProducts: Product[] = [];
  discounts: Discount[] = [];
  suppliers: any[] = [];
  locations: any[] = [];

  //  For edit mode
  isEditMode = false;
  purchaseId: number | null = null;

  //  Purchase items
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

    //  Check if route contains an ID (for edit mode)
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.purchaseId = Number(idParam);
        this.loadPurchaseById(this.purchaseId);
      }
    });
  }

  /**  Load purchase data for editing */
  loadPurchaseById(id: number): void {
    this.purchaseService.getPurchaseById(id).subscribe({
      next: (res: any) => {
        const purchase = res.data;
        if (!purchase) return;

        // Populate form fields
        this.supplier = String(purchase.contact_id);
        this.refNo = purchase.reference_number || '';
        this.purchaseDate = purchase.purchase_date?.split('T')[0] || '';
        this.status = purchase.purchase_status || '';
        this.location = String(purchase.bussiness_location_id);
        this.notes = purchase.additional_notes || '';
        this.amountPaid = Number(purchase.total_paid_amount) || 0;
        this.datePaid = purchase.date_paid_on?.split('T')[0] || '';
        this.paymentMethod = purchase.payment_method || '';

        // Handle single product (not array)
        const p = purchase.product;
        if (p) {
          const discount = purchase.discount || null;
          const discountAmount = discount ? Number(discount.discount_amount) : 0;
          const discountName = discount ? discount.discount_type : 'No Discount';
          const displayDiscount = discountAmount ? `Rs. ${discountAmount}` : '';

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

        this.purchaseItems.forEach((item) => this.updateLineTotal(item));
      },
      error: (err) => console.error('Error loading purchase:', err),
    });
  }

  /**  Setup product search listener */
  private setupSearchListener(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((q: string) => {
      const query = q.trim().toLowerCase();
      if (!query) {
        this.filteredProducts = [];
        return;
      }

      this.purchaseService.searchProducts(query).subscribe({
        next: (res: any) => {
          this.filteredProducts = Array.isArray(res?.data) ? res.data : [];
        },
        error: (err) => {
          console.error(' Error fetching products:', err);
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

  /** Discount selection */
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

  /** Delete product */
  deleteItem(id: number): void {
    this.purchaseItems = this.purchaseItems.filter((p) => p.id !== id);
  }

  /** Total items */
  get totalItems(): number {
    return this.purchaseItems.length;
  }

  /** Net total */
  get netTotal(): number {
    return this.purchaseItems.reduce((sum, item) => sum + item.total, 0);
  }

  /** Save or Update purchase */
  savePurchase(): void {
    if (!this.supplier || !this.refNo || !this.purchaseDate || !this.status || !this.location || this.purchaseItems.length === 0) {
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
      product_id: firstItem.id,
      quantity: firstItem.quantity,
      price: firstItem.price,
      discount_id: firstItem.discount_id || null,
      total_amount: firstItem.total,
    };

    if (this.isEditMode && this.purchaseId) {
      // UPDATE
      this.purchaseService.updatePurchase(this.purchaseId, payload).subscribe({
        next: () => {
          alert('Purchase updated successfully!');
          this.generatePurchaseInvoice(payload); 
          this.router.navigate(['/home/Purchase_list']);
        },
        error: (err) => console.error(' Error updating purchase:', err),
      });
    } else {
      // CREATE
      this.purchaseService.createPurchase(payload).subscribe({
        next: () => {
          alert('Purchase created successfully!');
          this.generatePurchaseInvoice(payload); 
          this.resetForm();
          this.router.navigate(['/home/Purchase_list']);
        },
        error: (err) => console.error(' Error creating purchase:', err),
      });
    }
  }

  /** Reset form */
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

 getBusinessLocations() {
  this.businessLocationService.getAllLocations().subscribe({
    next: (res: any) => {
      const data = res.data || res.locations;
      if (res.success && Array.isArray(data)) {
        this.locations = data.map((loc: any) => ({
          id: loc.id,
          name: loc.name,
          mobile: loc.mobile || '',
          email: loc.email || '',
        }));
      }
    },
    error: (err) => console.error(' Error fetching business locations:', err),
  });
}


  /** Fetch suppliers */
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
      error: (err) => console.error(' Error fetching suppliers:', err),
    });
  }

  /** Fetch discounts */
  getAllDiscounts() {
    this.discountService.getDiscounts().subscribe({
      next: (res: any) => (this.discounts = Array.isArray(res.data) ? res.data : []),
      error: (err) => console.error(' Error fetching discounts:', err),
    });
  }

  /** Generate Purchase Invoice PDF */
  generatePurchaseInvoice(purchase: any) {
    const selectedLocation = this.locations.find(b => b.id === Number(this.location));

    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200],
    });

    doc.setFontSize(10);
    doc.text(selectedLocation?.name || 'Business Name', 40, 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text(`Ph: ${selectedLocation?.mobile || ''}`, 40, 16, { align: 'center' });
    doc.text(`Email: ${selectedLocation?.email || ''}`, 40, 20, { align: 'center' });

    doc.line(5, 23, 75, 23);

    doc.setFontSize(8);
    doc.text(`Date: ${this.purchaseDate}`, 5, 27);
    doc.text(`Ref #: ${this.refNo}`, 60, 27);
    doc.text(`Supplier: ${this.suppliers.find(s => s.id === Number(this.supplier))?.name || ''}`, 5, 32);

    doc.line(5, 35, 75, 35);

    let y = 38;
    doc.text('Item', 5, y);
    doc.text('Qty', 35, y);
    doc.text('Rate', 45, y);
    doc.text('Total', 65, y);
    doc.line(5, y + 1, 75, y + 1);

    y += 5;
    this.purchaseItems.forEach(item => {
      doc.text(item.name.substring(0, 15), 5, y);
      doc.text(String(item.quantity), 35, y);
      doc.text(item.price.toFixed(2), 55, y, { align: 'right' });
      doc.text(item.total.toFixed(2), 75, y, { align: 'right' });
      y += 5;
    });

    doc.line(5, y - 2, 75, y - 2);

    y += 3;
    const netTotal = this.purchaseItems.reduce((sum, i) => sum + i.total, 0);
    doc.text(`Net Total: Rs. ${netTotal.toFixed(2)}`, 5, y);
    y += 4;

    this.purchaseItems.forEach(item => {
      if (item.discountAmount && item.discountName !== 'No Discount') {
        doc.text(`${item.discountName}: -Rs. ${item.discountAmount.toFixed(2)}`, 5, y);
        y += 4;
      }
    });

    doc.text(`Amount Paid: Rs. ${this.amountPaid.toFixed(2)}`, 5, y);
    y += 6;

    doc.setFontSize(8);
    doc.text('Thank you for your purchase!', 40, y, { align: 'center' });

    doc.output('dataurlnewwindow');
  }
}
