// models/saleItem.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SaleItem = sequelize.define(
  "SaleItem",
  {
    sale_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    tableName: "sale_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SaleItem;
