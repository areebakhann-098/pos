import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Discount = sequelize.define("Discount", {
 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  discount_type: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  discount_amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.0000,
  },
 

 
}, {
  tableName: "discounts",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Discount;
