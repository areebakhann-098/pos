// models/products.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Products = sequelize.define(
  "Products",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    product_name: { type: DataTypes.STRING, allowNull: false },
    product_description: { type: DataTypes.TEXT, allowNull: true },

    // foreign keys
    warranty_id: { type: DataTypes.INTEGER, allowNull: true },
    unit_id: { type: DataTypes.INTEGER, allowNull: false },
    variation_id: { type: DataTypes.INTEGER, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    sub_category_id: { type: DataTypes.INTEGER, allowNull: true },
    brands_id: { type: DataTypes.INTEGER, allowNull: true },
    tax_rate_id: { type: DataTypes.INTEGER, allowNull: true },
    price_id: { type: DataTypes.INTEGER, allowNull: true },

    //  new: BusinessLocation foreign key
    business_location_id: { type: DataTypes.INTEGER, allowNull: true },

    // expiry date
    expiry_date: { type: DataTypes.DATEONLY, allowNull: true },

    // additional fields
    weight: { type: DataTypes.FLOAT, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default Products;
