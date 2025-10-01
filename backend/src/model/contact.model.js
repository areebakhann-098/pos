import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Contact = sequelize.define("Contact", {

  contact_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplier_business_name: {
    type: DataTypes.STRING,
  },
 
  prefix: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  middle_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  zip_code: {
    type: DataTypes.STRING,
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  landline: {
    type: DataTypes.STRING,
  },
  alternate_number: {
    type: DataTypes.STRING,
  },
 
  created_by: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  
}, {
  sequelize,
  modelName: "Contact",
  tableName: "contacts",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true, 
  deletedAt: "deleted_at",
});

export default Contact;
