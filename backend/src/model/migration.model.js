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

    // ✅ Product ID (abhi optional)
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    reference_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "completed", "in_transit"),
      allowNull: false,
      defaultValue: "pending",
    },

    shipment_charges: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    additional_notes: {
      type: DataTypes.STRING,
      allowNull: true,
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
