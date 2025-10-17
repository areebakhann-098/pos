// models/saleReturnItem.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SaleReturnItem = sequelize.define(
  "SaleReturnItem",
  {
    sale_return_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    refund_amount: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    tableName: "sale_return_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SaleReturnItem;
