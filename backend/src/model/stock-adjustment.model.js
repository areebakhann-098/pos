import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
 
const StockAdjustment = sequelize.define(
  "StockAdjustment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
 
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    // business_location_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "BusinessLocations", // ✅ foreign key reference
    //     key: "id",
    //   },
    // },
 
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
      references: {
        model: "products", // ✅ foreign key reference
        key: "id",
      },
    },
 
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