import { DataTypes } from "sequelize";
import { sequelize } from '../config/db.js';

const Price = sequelize.define(
  "Price",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    profit_percent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sell_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  
  },
  {
    tableName: "prices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, 
    deletedAt: "deleted_at",
  }
);

export default Price;
