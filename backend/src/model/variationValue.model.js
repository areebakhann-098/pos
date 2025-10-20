import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Variation from "./variation.model.js";

const VariationValue = sequelize.define(
  "VariationValue",
  {
    value_name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. Red, Blue, Small
    },
    variation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Variation,
        key: "id",
      },
    },
  },
  {
    tableName: "variationValue",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);



export default VariationValue;
