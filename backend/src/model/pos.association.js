// models/pos.associations.js
import Contact from './contact.model.js';
import User from './users.model.js';
import Business from './business.model.js';
import Booking from './booking.model.js';
import Transaction from './transaction.model.js';
import Products from "./products.model.js";
import Warranty from "./warranty.model.js";
import Category from "./categories.model.js";
import TaxRate from "./tax-rate.model.js";
import Brand from "./brand.model.js";
import Unit from "./unit.model.js";
import Variation from "./variation.model.js";
import Price from "./price.model.js";
import StockAdjustment from "./stock-adjustment.model.js";
import BusinessLocation from "./business-location.model.js";
import Purchase from "./purchase.model.js";
import Discount from "./discount.model.js";  // ✅ import at top




// ===============================
// Contact Relations
// ===============================

// Contact ↔ User (Many-to-One)
const defineContactUserRelation = () => {
  Contact.belongsTo(User, { foreignKey: 'created_by', targetKey: 'id' });
  User.hasMany(Contact, { foreignKey: 'created_by', sourceKey: 'id' });
};

// Contact ↔ Business (Many-to-One)
const defineContactBusinessRelation = () => {
  Contact.belongsTo(Business, { foreignKey: 'business_id', targetKey: 'id' });
  Business.hasMany(Contact, { foreignKey: 'business_id', sourceKey: 'id' });
};

// Contact ↔ Booking (One-to-Many)
const defineContactBookingRelation = () => {
  Contact.hasMany(Booking, { foreignKey: 'contact_id', sourceKey: 'id' });
  Booking.belongsTo(Contact, { foreignKey: 'contact_id', targetKey: 'id' });
};

// Contact ↔ Transaction (One-to-Many)
const defineContactTransactionRelation = () => {
  Contact.hasMany(Transaction, { foreignKey: 'contact_id', sourceKey: 'id' });
  Transaction.belongsTo(Contact, { foreignKey: 'contact_id', targetKey: 'id' });
};


// ===============================
// Product Relations
// ===============================
const defineAssociations = () => {
  // Warranty ↔ Products
  Warranty.hasMany(Products, { foreignKey: "warranty_id", as: "products" });
  Products.belongsTo(Warranty, { foreignKey: "warranty_id", as: "warranty" });

  // Category ↔ Products
  Category.hasMany(Products, { foreignKey: "category_id", as: "products" });
  Products.belongsTo(Category, { foreignKey: "category_id", as: "Category" });

  // SubCategory ↔ Products (same Category model used)
  Category.hasMany(Products, { foreignKey: "sub_category_id", as: "sub_products" });
  Products.belongsTo(Category, { foreignKey: "sub_category_id", as: "SubCategory" });

  // TaxRate ↔ Products
  TaxRate.hasMany(Products, { foreignKey: "tax_rate_id", as: "products" });
  Products.belongsTo(TaxRate, { foreignKey: "tax_rate_id", as: "taxRate" });

  // Brand ↔ Products
  Brand.hasMany(Products, { foreignKey: "brands_id", as: "products" });
  Products.belongsTo(Brand, { foreignKey: "brands_id", as: "Brand" });


  // Unit ↔ Products
  Unit.hasMany(Products, { foreignKey: "unit_id", as: "products" });
  Products.belongsTo(Unit, { foreignKey: "unit_id", as: "unit" });

  // Variation ↔ Products
  Variation.hasMany(Products, { foreignKey: "variation_id", as: "products" });
  Products.belongsTo(Variation, { foreignKey: "variation_id", as: "variation" });

  // Price ↔ Products
  Price.hasMany(Products, { foreignKey: "price_id", as: "products" });
  Products.belongsTo(Price, { foreignKey: "price_id", as: "price" });

  // StockAdjustment ↔ Products
  Products.hasMany(StockAdjustment, { foreignKey: "product_id", as: "stockAdjustment" });
  StockAdjustment.belongsTo(Products, { foreignKey: "product_id", as: "products" });
  // Product ↔ BusinessLocation
BusinessLocation.hasMany(Products, { foreignKey: "business_location_id", as: "products" });
Products.belongsTo(BusinessLocation, { foreignKey: "business_location_id", as: "businessLocation" });


 // ===============================
  // Purchase Relations
  // ===============================

  // Purchase ↔ Product
  Purchase.belongsTo(Products, { foreignKey: "product_id", as: "product" });
  Products.hasMany(Purchase, { foreignKey: "product_id", as: "purchases" });

  // Purchase ↔ BusinessLocation
  Purchase.belongsTo(BusinessLocation, { foreignKey: "bussiness_location_id", as: "businessLocation" });
  BusinessLocation.hasMany(Purchase, { foreignKey: "bussiness_location_id", as: "purchases" });

  // Purchase ↔ Contact
  Purchase.belongsTo(Contact, { foreignKey: "contact_id", as: "contact" });
  Contact.hasMany(Purchase, { foreignKey: "contact_id", as: "purchases" });

   // ✅ New: Purchase ↔ Discount
  Purchase.belongsTo(Discount, { foreignKey: "discount_id", as: "discount" });
  Discount.hasMany(Purchase, { foreignKey: "discount_id", as: "purchases" });
};


// ===============================
// Exports
// ===============================
export {
  defineContactUserRelation,
  defineContactBusinessRelation,
  defineContactBookingRelation,
  defineContactTransactionRelation,
  defineAssociations,
  Products,
  Warranty,
  Category,
  TaxRate,
  Brand,
  Unit,
  Variation,
  Price,
  StockAdjustment,
  BusinessLocation,
  Contact,
  Discount
};
