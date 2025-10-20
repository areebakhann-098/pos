import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Variation = sequelize.define(
  "Variation",
  {
    variation_name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. Color, Size
    },
  },
  {
    tableName: "variations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default Variation;
