import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const TaxRate = sequelize.define("TaxRate", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE, // ✅ Tax Rate % like 5.00, 10.50
    allowNull: false,
  },

}, {
  sequelize,
  modelName: "TaxRate",
  tableName: "tax_rates",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,   // ✅ Soft delete
  deletedAt: "deleted_at",
});

export default TaxRate;
