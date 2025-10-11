// models/pos.associations.js
import Contact from "./contact.model.js";
import User from "./users.model.js";
import Business from "./business.model.js";
import Booking from "./booking.model.js";
import Transaction from "./transaction.model.js";
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
import Discount from "./discount.model.js"; // ✅ import at top
import Sale from "./sale.model.js";
import Migration from "./migration.model.js";
import SaleItem from "./SaleItem.model.js";

// ===============================
// Contact Relations
// ===============================

// Contact ↔ User (Many-to-One)
const defineContactUserRelation = () => {
  Contact.belongsTo(User, { foreignKey: "created_by", targetKey: "id" });
  User.hasMany(Contact, { foreignKey: "created_by", sourceKey: "id" });
};

// Contact ↔ Business (Many-to-One)
const defineContactBusinessRelation = () => {
  Contact.belongsTo(Business, { foreignKey: "business_id", targetKey: "id" });
  Business.hasMany(Contact, { foreignKey: "business_id", sourceKey: "id" });
};

// Contact ↔ Booking (One-to-Many)
const defineContactBookingRelation = () => {
  Contact.hasMany(Booking, { foreignKey: "contact_id", sourceKey: "id" });
  Booking.belongsTo(Contact, { foreignKey: "contact_id", targetKey: "id" });
};

// Contact ↔ Transaction (One-to-Many)
const defineContactTransactionRelation = () => {
  Contact.hasMany(Transaction, { foreignKey: "contact_id", sourceKey: "id" });
  Transaction.belongsTo(Contact, { foreignKey: "contact_id", targetKey: "id" });
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
  Category.hasMany(Products, {
    foreignKey: "sub_category_id",
    as: "sub_products",
  });
  Products.belongsTo(Category, {
    foreignKey: "sub_category_id",
    as: "SubCategory",
  });

  // TaxRate ↔ Products
  TaxRate.hasMany(Products, { foreignKey: "tax_rate_id", as: "products" });
  Products.belongsTo(TaxRate, { foreignKey: "tax_rate_id", as: "taxRate" });

  // 🏷 Brand ↔ Products
  Brand.hasMany(Products, { foreignKey: "brands_id", as: "products" });
Products.belongsTo(Brand, { foreignKey: "brands_id", as: "brand" });
  // ⚖️ Unit ↔ Products
  Unit.hasMany(Products, { foreignKey: "unit_id", as: "products" });
  Products.belongsTo(Unit, { foreignKey: "unit_id", as: "unit" });

  Variation.hasMany(Products, { foreignKey: "variation_id", as: "products" });
  Products.belongsTo(Variation, {
    foreignKey: "variation_id",
    as: "variation",
  });

  // Price ↔ Products
  Price.hasMany(Products, { foreignKey: "price_id", as: "products" });
  Products.belongsTo(Price, { foreignKey: "price_id", as: "price" });

  // StockAdjustment ↔ Products
  Products.hasMany(StockAdjustment, {
    foreignKey: "product_id",
    as: "stockAdjustment",
  });

  StockAdjustment.belongsTo(Products, {
    foreignKey: "product_id",
    as: "product",
  });
  Contact.hasMany(StockAdjustment, {
    foreignKey: "contact_id",
    as: "stockAdjustment",
  });
  StockAdjustment.belongsTo(Contact, {
    foreignKey: "contact_id",
    as: "contacts",
  });

  BusinessLocation.hasMany(StockAdjustment, {
    foreignKey: "BusinessLocation_id",
    as: "stockAdjustment",
  });
  StockAdjustment.belongsTo(BusinessLocation, {
    foreignKey: "BusinessLocation_id",
    as: "businessLocation",
  });

  // Product ↔ BusinessLocation
  BusinessLocation.hasMany(Products, {
    foreignKey: "business_location_id",
    as: "product",
  });
  Products.belongsTo(BusinessLocation, {
    foreignKey: "business_location_id",
    as: "businessLocation",
  });

  // ===============================
  // Purchase Relations
  // ===============================

  // Purchase ↔ Product
  Purchase.belongsTo(Products, { foreignKey: "product_id", as: "product" });
  Products.hasMany(Purchase, { foreignKey: "product_id", as: "purchases" });

  // Purchase ↔ BusinessLocation
  Purchase.belongsTo(BusinessLocation, {
    foreignKey: "bussiness_location_id",
    as: "businessLocation",
  });
  BusinessLocation.hasMany(Purchase, {
    foreignKey: "bussiness_location_id",
    as: "purchases",
  });

  // Purchase ↔ Contact
  Purchase.belongsTo(Contact, { foreignKey: "contact_id", as: "contact" });
  Contact.hasMany(Purchase, { foreignKey: "contact_id", as: "purchases" });

  // ✅ New: Purchase ↔ Discount
  Purchase.belongsTo(Discount, { foreignKey: "discount_id", as: "discount" });
  Discount.hasMany(Purchase, { foreignKey: "discount_id", as: "purchases" });

  // ===============================
  // Sale Relations
  // ===============================

  // Sale ↔ Customer
  Sale.belongsTo(Contact, { foreignKey: "customer_id", as: "customer" });
  Contact.hasMany(Sale, { foreignKey: "customer_id", as: "sales" });

  // Sale ↔ BusinessLocation
  Sale.belongsTo(BusinessLocation, {
    foreignKey: "business_location_id",
    as: "businessLocation",
  });
  BusinessLocation.hasMany(Sale, {
    foreignKey: "business_location_id",
    as: "sales",
  });

  // Sale ↔ Discount
  Sale.belongsTo(Discount, { foreignKey: "discount_id", as: "discount" });
  Discount.hasMany(Sale, { foreignKey: "discount_id", as: "sales" });

  // Sale ↔ TaxRate
  Sale.belongsTo(TaxRate, { foreignKey: "tax_id", as: "tax" });
  TaxRate.hasMany(Sale, { foreignKey: "tax_id", as: "sales" });
  // SaleItem ↔ Product
  Sale.belongsTo(Products, { foreignKey: "product_id", as: "product" });
  Products.hasMany(Sale, { foreignKey: "product_id", as: "sales" });
  // ===============================
  // Stock Transfer Relations
  // ===============================
  // Migration ↔ Product
  Migration.belongsTo(Products, { foreignKey: "product_id", as: "product" });
  Products.hasMany(Migration, { foreignKey: "product_id", as: "migrations" });

  // Migration ↔ From Location
  Migration.belongsTo(BusinessLocation, {
    foreignKey: "from_location_id",
    as: "fromBusinessLocation", // ✅ unique alias
  });
  BusinessLocation.hasMany(Migration, {
    foreignKey: "from_location_id",
    as: "migrationsFromLocation", // ✅ unique alias
  });

  // Migration ↔ To Location
  Migration.belongsTo(BusinessLocation, {
    foreignKey: "to_location_id",
    as: "toBusinessLocation", // ✅ unique alias
  });
  BusinessLocation.hasMany(Migration, {
    foreignKey: "to_location_id",
    as: "migrationsToLocation", // ✅ unique alias
  });
};
const defineSaleAssociations = () => {
  // 🧾 Sale ↔ SaleItem (One-to-Many)
  Sale.hasMany(SaleItem, { foreignKey: "sale_id", as: "saleItems" });
  SaleItem.belongsTo(Sale, { foreignKey: "sale_id", as: "parentSale" });

  // 🧩 SaleItem ↔ Product (Many SaleItems belong to one Product)
  SaleItem.belongsTo(Products, { foreignKey: "product_id", as: "product" });
  Products.hasMany(SaleItem, {
    foreignKey: "product_id",
    as: "productSaleItems",
  });

  // 🏢 Sale ↔ BusinessLocation (Each sale belongs to one location)
  Sale.belongsTo(BusinessLocation, {
    foreignKey: "business_location_id",
    as: "saleBusinessLocation", // ✅ unique alias
  });
  BusinessLocation.hasMany(Sale, {
    foreignKey: "business_location_id",
    as: "locationSales", // ✅ unique alias
  });

  // 💸 Sale ↔ Discount (Each sale may have one discount)
  Sale.belongsTo(Discount, { foreignKey: "discount_id", as: "saleDiscount" }); // ✅ changed
  Discount.hasMany(Sale, { foreignKey: "discount_id", as: "discountSales" }); // ✅ unique alias

  // 🧾 Sale ↔ TaxRate (Each sale may have one tax rate)
  Sale.belongsTo(TaxRate, { foreignKey: "tax_id", as: "saleTax" }); // ✅ changed
  TaxRate.hasMany(Sale, { foreignKey: "tax_id", as: "taxSales" }); // ✅ unique alias
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
  defineSaleAssociations,
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
  Discount,
  Sale,
  Migration,
  SaleItem,
};
