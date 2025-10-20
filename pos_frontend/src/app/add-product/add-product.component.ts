import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrandService } from '../core/services/brand/brand.service';
import { UnitService } from '../core/services/unit/unit.service';
import { CategoriesService } from '../core/services/categories/categories.service';
import { VariationService } from '../core/services/variation/variation.service';
import { WarrantiesService } from '../core/services/warrenties/warranties.service';
import { TaxRateService } from '../core/services/tax_rate/tax-rate.service';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';
import { ProductService } from '../core/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  brands: any[] = [];
  units: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  variations: any[] = [];
  warranties: any[] = [];
  taxRates: any[] = [];
  locations: any[] = [];
  selectedVariationValues: any[] = [];

  productData: any = {
    product_name: '',
    product_description: '',
    warranty_id: '',
    unit_id: '',
    variation_id: '',
    variation_value: '',
    category_id: '',
    sub_category_id: '',
    brands_id: '',
    tax_rate_id: '',
    business_location_id: '',
    expiry_date: '',
    weight: 0,
    quantity: 0,
    profit_percent: '',
    purchase_price: '',
    sell_price: ''
  };

  isEditMode = false;
  productId: number | null = null;

  constructor(
    private brandService: BrandService,
    private unitService: UnitService,
    private categoriesService: CategoriesService,
    private warrantyService: WarrantiesService,
    private variationService: VariationService,
    private taxRateService: TaxRateService,
    private locationService: BusinessLocationService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load dropdown data
    this.getAllBrands();
    this.getAllUnits();
    this.getAllCategories();
    this.getAllWarranties();
    this.getAllVariations();
    this.getAllTaxRates();
    this.getAllLocations();

    // 🧠 Check if edit mode
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProductData(this.productId);
      }
    });
  }

  // ✅ Load Product for Edit
  loadProductData(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        const product = res?.data;
        console.log("🧾 Product for edit:", product);

        if (product) {
          this.productData = {
            product_name: product.product_name,
            product_description: product.product_description,
            warranty_id: product.warranty_id || product.warranty?.id || '',
            unit_id: product.unit_id || product.unit?.id || '',
            variation_id: product.variation?.id || '',
            variation_value: product.variation_value || '',
            category_id: product.category_id || product.Category?.id || '',
            sub_category_id: product.sub_category_id || product.SubCategory?.id || '',
            brands_id: product.brands_id || product.brand?.id || '',
            tax_rate_id: product.taxRate?.id || '',
            business_location_id: product.businessLocation?.id || '',
            expiry_date: product.expiry_date,
            weight: product.weight,
            quantity: product.quantity,
            profit_percent: product.price?.profit_percent,
            purchase_price: product.price?.purchase_price,
            sell_price: product.price?.sell_price,
          };

          if (product.variation?.id) {
            this.onVariationChange(); // preload variation values
          }
        }
      },
      error: (err) => console.error('❌ Error fetching product:', err),
    });
  }

  // ✅ Variation Change
  onVariationChange() {
    const selected = this.variations.find(v => v.id == this.productData.variation_id);
    this.selectedVariationValues = selected ? selected.values || [] : [];
    this.productData.variation_value = ''; // reset
  }

  // ✅ Submit Product
  onSubmit() {
    if (this.isEditMode && this.productId) {
      // ✏️ Update existing product
      this.productService.updateProduct(this.productId, this.productData).subscribe({
        next: () => {
          alert('✅ Product updated successfully!');
          this.router.navigate(['/product_list']);
        },
        error: (err) => {
          console.error('❌ Error updating product:', err);
          alert('Update failed: ' + err.error.message);
        },
      });
    } else {
      // ➕ Create new product
      this.productService.createProduct(this.productData).subscribe({
        next: () => {
          alert('✅ Product added successfully!');
          this.router.navigate(['/product_list']);
        },
        error: (err) => {
          console.error('❌ Error adding product:', err);
          alert('Error: ' + err.error.message);
        },
      });
    }
  }

  // ========== Fetch Data ==========
  getAllBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (res) => (this.brands = Array.isArray(res) ? res : res.data || []),
      error: (err) => console.error('Error fetching brands:', err),
    });
  }

  getAllUnits() {
    this.unitService.getAllUnits().subscribe({
      next: (res) => (this.units = Array.isArray(res) ? res : res.data || []),
      error: (err) => console.error('Error fetching units:', err),
    });
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => (this.categories = Array.isArray(res) ? res : res.data || []),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getAllWarranties() {
    this.warrantyService.getWarranties().subscribe({
      next: (res) => (this.warranties = Array.isArray(res) ? res : res.data || []),
      error: (err) => console.error('Error fetching warranties:', err),
    });
  }

  getAllVariations() {
    this.variationService.getAllVariations().subscribe({
      next: (res) => (this.variations = res.data || []),
      error: (err) => console.error('Error fetching variations:', err),
    });
  }

  getAllTaxRates() {
    this.taxRateService.getAllTaxRates().subscribe({
      next: (res) => (this.taxRates = Array.isArray(res) ? res : res.data || []),
      error: (err) => console.error('Error fetching tax rates:', err),
    });
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res: any) => (this.locations = res.locations || []),
      error: (err) => console.error('Error fetching locations:', err),
    });
  }

  // ✅ Auto Price Calculation
  calculateSellPrice() {
    const purchase = Number(this.productData.purchase_price) || 0;
    const profit = Number(this.productData.profit_percent) || 0;

    // 💰 Base sell price before tax
    let sellPrice = purchase + (purchase * profit / 100);

    // 🧾 If tax is selected, add tax to the sell price
    const selectedTax = this.taxRates.find(t => t.id == this.productData.tax_rate_id);
    if (selectedTax && selectedTax.amount) {
      const taxAmount = Number(selectedTax.amount);
      sellPrice += (sellPrice * taxAmount / 100);
    }

    this.productData.sell_price = Number(sellPrice.toFixed(2));
  }
}
