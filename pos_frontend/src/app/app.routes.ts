import { Routes } from '@angular/router';

export const routes: Routes = [
 {
    path: 'AddContacts',                  
    loadComponent: () =>
      import('./add-contact/add-contact.component').then(m => m.AddContactComponent)  
  },
  {
    path: 'AddProducts',
    loadComponent: ()=>
      import('./add-product/add-product.component').then(m=> m.AddProductComponent)
      
    },
    {
    path: 'Variations',
    loadComponent: ()=>
      import('./variations/variations.component').then(m=> m.VariationsComponent)
      
    },
     {
    path: 'Units',
    loadComponent: ()=>
      import('./units/units.component').then(m=> m.UnitsComponent)
      
    },
     {
    path: 'Categories',
    loadComponent: ()=>
      import('./categories/categories.component').then(m=> m.CategoriesComponent)
      
    },
    {
    path: 'Warranties',
    loadComponent: ()=>
      import('./warranties/warranties.component').then(m=> m.WarrantiesComponent)
      
    },
    {
    path: 'Brands',
    loadComponent: ()=>
      import('./brands/brands.component').then(m=> m.BrandsComponent)
      
    },
     {
    path: 'Discounts',
    loadComponent: ()=>
      import('./discount/discount.component').then(m=> m.DiscountComponent)
      
    },
      {
    path: 'Purchases',
    loadComponent: ()=>
      import('./add-purchases/add-purchases.component').then(m=> m.AddPurchasesComponent)
      
    },
    {
    path: 'PurchaseReturn',
    loadComponent: ()=>
      import('./purchase-return/purchase-return.component').then(m=> m.PurchaseReturnComponent)
      
    },
     {
    path: 'stockTransfer',
    loadComponent: ()=>
      import('./stock-transfer/stock-transfer.component').then(m=> m.StockTransferComponent)
      
    },
   {
    path: 'stockadjustments',
    loadComponent: ()=>
      import('./stock-adjustments/stock-adjustments.component').then(m=> m.StockAdjustmentsComponent)
      
    },
  
 
   {
    path:'businessLocation',
    loadComponent: ()=>
      import('./business-location/business-location.component').then(m=> m.BusinessLocationComponent)
      
    },
    {
    path:'POS',
    loadComponent: ()=>
      import('./pos/pos.component').then(m=> m.PosComponent)
      
    },

     {
    path:'taxRate',
    loadComponent: ()=>
      import('./tax-rate/tax-rate.component').then(m=> m.TaxRateComponent)
      
    },
];
