import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
 
const Category = sequelize.define("Category", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  sub_category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
 
}, {
  sequelize,
  modelName: "Category",
  tableName: "category",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,       // ✅ soft delete
  deletedAt: "deleted_at",
});
 
export default Category;