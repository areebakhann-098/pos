import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { StockTransferService } from '../core/services/stock_transfer/stock-transfer.service';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';

interface Product {
  id?: number | string;
  _id?: number | string;
  product_id?: number | string;
  productId?: number | string;
  name?: string;
  product_name?: string;
  price?: { purchase_price?: number };
  purchase_price?: number;
}

interface TransferItem {
  product_id: number | string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-stock-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-transfer.component.html',
})
export class StockTransferComponent implements OnInit {
  referenceNo = '';
  date = '';
  status = 'pending';
  fromLocation: number | null = null;
  toLocation: number | null = null;
  additionalNotes = '';
  shippingCharges = 0;

  searchQuery = '';
  filteredProducts: Product[] = [];
  private searchSubject = new Subject<string>();

  items: TransferItem[] = [];
  locations: any[] = [];
  isEditMode = false;
  transferId: number | null = null;

  constructor(
    private stockTransferService: StockTransferService,
    private businessLocationService: BusinessLocationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.setupSearchListener();
  }

  ngOnInit(): void {
    this.loadLocations();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.transferId = Number(idParam);
      this.isEditMode = true;
      this.loadTransferData(this.transferId);
    }
  }

  /** Load Locations */
  private loadLocations(): void {
    this.businessLocationService.getAllLocations().subscribe({
      next: (res: any) => {
        this.locations = res.locations || [];
      },
      error: () => {
        // silently handle errors
      },
    });
  }

private loadTransferData(id: number): void {
  this.stockTransferService.getStockTransferById(id).subscribe({
    next: (res: any) => {
      const data = res?.data || res;


      // Basic Info
      this.referenceNo = data.reference_no || '';
      this.date = data.date || '';
      this.status = data.status || 'pending';
      this.fromLocation = data.from_location_id || null;
      this.toLocation = data.to_location_id || null;
      this.additionalNotes = data.additional_notes || '';
      this.shippingCharges = Number(data.shipment_charges) || 0;

      // Ensure products are an array
      const productsArray = Array.isArray(data.products) ? data.products : [data];

      // Map Products
      this.items = productsArray.map((p: any, index: number) => {
        const productId = Number(p.product_id ?? p.id ?? p.product?.id ?? 0);
        const name = p.product?.product_name || p.product_name || 'Unnamed Product';
        const quantity = Number(p.quantity) || 1;

        // ✅ Correct path for price
        const price = Number(p.product?.price?.purchase_price) || 0;

        console.log(`Product: ${name}, Quantity: ${quantity}, Price: ${price}`);

        const total = quantity * price;
        return { product_id: productId, name, quantity, price, total };
      });

      // Update totals
      this.items.forEach((item) => this.updateLineTotal(item));
    },
    error: (err) => {
      console.error('❌ Error loading transfer:', err);
    },
  });
}



  /** Search Products (Debounced) */
  private setupSearchListener(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((query: string) => {
        const q = query.trim().toLowerCase();
        if (!q) {
          this.filteredProducts = [];
          return;
        }

        this.stockTransferService.searchProducts(q).subscribe({
          next: (res: any) => {
            this.filteredProducts = Array.isArray(res?.data) ? res.data : [];
          },
          error: () => {
            this.filteredProducts = [];
          },
        });
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  /** Add Product */
  addProduct(product: Product): void {
    const productId = Number(
      product.id ?? product._id ?? product.product_id ?? product.productId ?? 0
    );
    const name = product.product_name ?? product.name ?? 'Unnamed Product';
    const price = product.price?.purchase_price ?? product.purchase_price ?? 0;

    if (!productId) return;

    const existing = this.items.find((i) => i.product_id === productId);
    if (existing) {
      existing.quantity += 1;
      this.updateLineTotal(existing);
    } else {
      const newItem: TransferItem = {
        product_id: productId,
        name,
        quantity: 1,
        price,
        total: price,
      };
      this.updateLineTotal(newItem);
      this.items.push(newItem);
    }

    this.searchQuery = '';
    this.filteredProducts = [];
  }

  /** Update Line Total */
  updateLineTotal(item: TransferItem): void {
    item.total = (Number(item.quantity) || 0) * (Number(item.price) || 0);
  }

  /** Remove Item */
  removeItem(product_id: number | string): void {
    this.items = this.items.filter((i) => i.product_id !== product_id);
  }

  /** Total Amount */
  get totalAmount(): number {
    return this.items.reduce((sum, i) => sum + i.total, 0) + (this.shippingCharges || 0);
  }

 /** Save or Update Transfer */
saveTransfer(): void {
  if (!this.referenceNo || !this.date || !this.fromLocation || !this.toLocation) {
    alert('⚠️ Please fill all required fields before saving.');
    return;
  }

  const payload = {
    from_location_id: this.fromLocation,
    to_location_id: this.toLocation,
    reference_no: this.referenceNo,
      total_amount: this.totalAmount, // ✅ NEW FIELD ADDED HERE

    date: this.date,
    status: this.status,
    shipment_charges: this.shippingCharges,
    additional_notes: this.additionalNotes,
    products: this.items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
      line_total: i.total,
    })),
  };

  if (this.isEditMode && this.transferId) {
    // ✏️ UPDATE transfer
    this.stockTransferService.updateStockTransfer(this.transferId, payload).subscribe({
      next: () => {
        alert('✅ Stock Transfer updated successfully!');
        this.router.navigate(['/home/stocktransfer_list']); // go to list
      },
      error: (err) => {
        console.error('❌ Error updating stock transfer:', err);
        alert('❌ Failed to update stock transfer!');
      },
    });
  } else {
    // ➕ CREATE new transfer
    this.stockTransferService.createStockTransfer(payload).subscribe({
      next: () => {
        alert('✅ Stock Transfer created successfully!');
        this.resetForm();
        this.router.navigate(['/home/stocktransfer_list']); // go to list
      },
      error: (err) => {
        console.error('❌ Error creating stock transfer:', err);
        alert('❌ Failed to create stock transfer!');
      },
    });
  }
}

  /** Reset Form */
  resetForm(): void {
    this.referenceNo = '';
    this.date = '';
    this.status = 'pending';
    this.fromLocation = null;
    this.toLocation = null;
    this.additionalNotes = '';
    this.shippingCharges = 0;
    this.items = [];
    this.searchQuery = '';
    this.filteredProducts = [];
  }

  /** TrackBy for ngFor */
  trackByProductId(index: number, item: TransferItem) {
    return item.product_id;
  }
}
