// models/saleReturn.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SaleReturn = sequelize.define(
  "SaleReturn",
  {
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total_refund_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "salereturns",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SaleReturn;
