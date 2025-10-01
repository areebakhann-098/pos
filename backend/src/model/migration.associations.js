// models/migration.associations.js
// import Products from "./products.model.js";
import BusinessLocation from "./business-location.model.js";
import Migration  from './migration.model.js'

export const defineMigrationAssociations = () => {
  // ✅ Product ↔ Migration
//   Products.hasMany(Migration, { foreignKey: "product_id", as: "migrations" });
//   Migration.belongsTo(Products, { foreignKey: "product_id", as: "product" });

  // ✅ From Location ↔ Migration
  BusinessLocation.hasMany(Migration, { foreignKey: "from_location_id", as: "migrations_from" });
  Migration.belongsTo(BusinessLocation, { foreignKey: "from_location_id", as: "fromLocation" });

  // ✅ To Location ↔ Migration
  BusinessLocation.hasMany(Migration, { foreignKey: "to_location_id", as: "migrations_to" });
  Migration.belongsTo(BusinessLocation, { foreignKey: "to_location_id", as: "toLocation" });
};

export { Migration, BusinessLocation };
