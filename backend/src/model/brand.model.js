import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
 
const Brand = sequelize.define("Brand", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
}, {
  sequelize,
  modelName: "Brand",
  tableName: "brand",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,   // ✅ Soft delete
  deletedAt: "deleted_at",
});
 
export default Brand