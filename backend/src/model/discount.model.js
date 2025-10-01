import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Discount = sequelize.define("Discount", {
 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  discount_type: {
    type: DataTypes.STRING, // e.g. "percentage" | "fixed"
    allowNull: true,
  },
  discount_amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.0000,
  },
 
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
 
}, {
  tableName: "discounts",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Discount;
