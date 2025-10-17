import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Migration = sequelize.define(
  "Migration",
  {
    from_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false, // ✅ Required
      defaultValue: 0,
    },
    reference_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    shipment_charges: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    additional_notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   total_amount: {               
      type: DataTypes.NUMERIC(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    modelName: "Migration",
    tableName: "migration",
    timestamps: true,
    paranoid: true,
  }
);

export default Migration;
