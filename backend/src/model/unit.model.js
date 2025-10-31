import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
 
const Unit = sequelize.define("Unit", {
 name: {
    type: DataTypes.STRING(191),
    allowNull: false,
  },
  short_name: {
    type: DataTypes.STRING(191),
    allowNull: false,
  },
 

}, {
  sequelize,
  modelName: "Unit",
  tableName: "unit",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,
  deletedAt: "deleted_at",
});
 
export default Unit;