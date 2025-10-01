// models/BusinessLocation.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const BusinessLocation = sequelize.define("BusinessLocation", {
 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  landmark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
  
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },


  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "businessLocation",
  timestamps: true,
  underscored: true,
  paranoid: true, // soft delete support
});

export default BusinessLocation;
