import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const TaxRate = sequelize.define("TaxRate", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE, 
    allowNull: false,
  },

}, {
  sequelize,
  modelName: "TaxRate",
  tableName: "tax_rates",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,   
  deletedAt: "deleted_at",
});

export default TaxRate;
