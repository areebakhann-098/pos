import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
const StockAdjustment = sequelize.define(
  "StockAdjustment",
  {
    contact_id:{
          type: DataTypes.INTEGER,
      allowNull: false,
    },
    BusinessLocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    adjustment_type: {
      type: DataTypes.ENUM("normal", "abnormal"),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    recovery_amount: {
      type: DataTypes.DECIMAL, // ✅ number with decimals
      allowNull: true,
    },

    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "StockAdjustment",
    tableName: "stockAdjustment", // ✅ custom table name
    timestamps: true, // ✅ createdAt, updatedAt
    paranoid: true, // ✅ soft deletes (deletedAt column)
  }
);

export default StockAdjustment;
