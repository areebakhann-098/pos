import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Variation = sequelize.define(
  "Variation",
  {

    variation_name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. Size, Color
    },

    variation_value: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  },
  {
    tableName: "variation",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // ✅ soft delete
    deletedAt: "deleted_at",
  }
);

export default Variation;
