// models/sales.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Sale = sequelize.define(
  "Sale",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    // Sale info
    invoice_no: { type: DataTypes.STRING, allowNull: false },
    sale_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
   product_id: { 
  type: DataTypes.INTEGER, 
  allowNull: true 
},

    // Customer / Contact
    customer_id: { type: DataTypes.INTEGER, allowNull: false },

    // Location
    business_location_id: { type: DataTypes.INTEGER, allowNull: false },

    // Totals
    total_items: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total_amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    discount_id: { type: DataTypes.INTEGER, allowNull: true },
    tax_id: { type: DataTypes.INTEGER, allowNull: true },
    final_amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },

    // Payment Info
    payment_status: { 
      type: DataTypes.ENUM("pending", "paid", "partial", "cancelled"),
      defaultValue: "pending"
    },
    payment_method: { 
      type: DataTypes.ENUM("cash", "card", "credit", "multiple"),
      allowNull: true
    },
    amount_paid: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },

    notes: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    tableName: "sales",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Sale;
