import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'AddContacts',
    loadComponent: () =>
      import('./add-contact/add-contact.component').then(
        (m) => m.AddContactComponent
      ),
  },
  {
    path: 'contact_list',
    loadComponent: () =>
      import('./contact-list/contact-list.component').then(
        (m) => m.ContactListComponent
      ),
  },
   {
  path: 'add-contact/edit/:id',
  loadComponent: () =>
    import('./add-contact/add-contact.component').then(
      (m) => m.AddContactComponent
    ),
},


  {
    path: 'Variations',
    loadComponent: () =>
      import('./variations/variations.component').then(
        (m) => m.VariationsComponent
      ),
  },
  {
    path: 'Units',
    loadComponent: () =>
      import('./units/units.component').then((m) => m.UnitsComponent),
  },
  {
    path: 'Categories',
    loadComponent: () =>
      import('./categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
  },
  {
    path: 'Warranties',
    loadComponent: () =>
      import('./warranties/warranties.component').then(
        (m) => m.WarrantiesComponent
      ),
  },
  {
    path: 'Brands',
    loadComponent: () =>
      import('./brands/brands.component').then((m) => m.BrandsComponent),
  },
  {
    path: 'Discounts',
    loadComponent: () =>
      import('./discount/discount.component').then((m) => m.DiscountComponent),
  },
  {
    path: 'Purchases',
    loadComponent: () =>
      import('./add-purchases/add-purchases.component').then(
        (m) => m.AddPurchasesComponent
      ),
  },
  {
    path: 'PurchaseReturn',
    loadComponent: () =>
      import('./purchase-return/purchase-return.component').then(
        (m) => m.PurchaseReturnComponent
      ),
  },
  {
    path: 'stockTransfer',
    loadComponent: () =>
      import('./stock-transfer/stock-transfer.component').then(
        (m) => m.StockTransferComponent
      ),
  },
  {
    path: 'stockadjustments',
    loadComponent: () =>
      import('./stock-adjustments/stock-adjustments.component').then(
        (m) => m.StockAdjustmentsComponent
      ),
  },

  {
    path: 'POS',
    loadComponent: () =>
      import('./pos/pos.component').then((m) => m.PosComponent),
  },

  {
    path: 'taxRate',
    loadComponent: () =>
      import('./tax-rate/tax-rate.component').then((m) => m.TaxRateComponent),
  },

  {
    path: 'location_list',
    loadComponent: () =>
      import('./business-location-list/business-location-list.component').then(
        (m) => m.BusinessLocationListComponent
      ),
  },
  {
    path: 'businessLocation',
    loadComponent: () =>
      import('./business-location/business-location.component').then(
        (m) => m.BusinessLocationComponent
      ),
  },
  {
    path: 'businessLocation/edit/:id',
    loadComponent: () =>
      import('./business-location/business-location.component').then(
        (m) => m.BusinessLocationComponent
      ),
  },
  {
    path: 'AddProducts',
    loadComponent: () =>
      import('./add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: 'product_list',
    loadComponent: () =>
      import('./product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
    {
    path: 'Purchase_list',
    loadComponent: () =>
      import('./purchase-list/purchase-list.component').then(
        (m) => m.PurchaseListComponent
      ),
  },
  
  {
    path: 'stocktransfer_list',
    loadComponent: () =>
      import('./stocktransfer-list/stocktransfer-list.component').then(
        (m) => m.StocktransferListComponent
      ),
  },
   {
    path: 'stockadjustments_list',
    loadComponent: () =>
      import('./stockadjustments-list/stockadjustments-list.component').then(
        (m) => m.StockadjustmentsListComponent
      ),
  },
  {
    path: 'sales_list',
    loadComponent: () =>
      import('./sale-list/sale-list.component').then(
        (m) => m.SaleListComponent
      ),
  },
   {
    path: 'productsale_list',
    loadComponent: () =>
      import('./productsell-report/productsell-report.component').then(
        (m) => m.ProductsellReportComponent
      ),
  },
 
 {
  path: 'stockadjustments/edit/:id',
  loadComponent: () =>
    import('./stock-adjustments/stock-adjustments.component').then(
      (m) => m.StockAdjustmentsComponent
    ),
},
 {
  path: 'stocktransfer/edit/:id',
  loadComponent: () =>
    import('./stock-transfer/stock-transfer.component').then(
      (m) => m.StockTransferComponent
    ),
},

  {
    path: 'addproduct/edit/:id',
    loadComponent: () =>
      import('./add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
  path: 'Purchases/edit/:id',
  loadComponent: () =>
    import('./add-purchases/add-purchases.component').then(
      (m) => m.AddPurchasesComponent
    ),
},
  {
  path: 'Purchase-report',
  loadComponent: () =>
    import('./purchase-report/purchase-report.component').then(
      (m) => m.PurchaseReportComponent
    ),
},
 {
  path: 'Stock-report',
  loadComponent: () =>
    import('./stock-report/stock-report.component').then(
      (m) => m.StockReportComponent
    ),
},
{
  path: 'adjustment-report',
  loadComponent:() => 
    import('./adjustments-report/adjustments-report.component') .then (
      (m) => m.AdjustmentsReportComponent

    )

},
{
  path: 'trasnfer-report',
  loadComponent:() => 
    import('./stocktransfer-report/stocktransfer-report.component') .then (
      (m) => m.StocktransferReportComponent

    )

}
,
{
  path: 'sale-return',
  loadComponent:() => 
    import('./sale-return/sale-return.component') .then (
      (m) => m.SaleReturnComponent

    )

},
{
  path: 'sale-return-report',
  loadComponent:() => 
    import('./sale-return-report/sale-return-report.component') .then (
      (m) => m.SaleReturnReportComponent

    )

},
  // ✅ Dashboard route
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },

  // ✅ Wildcard route (for 404 handling)
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
