// models/user.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  surname: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "en",
  },
  contact_no: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  remember_token: {
    type: DataTypes.STRING,
  },
  business_id: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  available_at: {
    type: DataTypes.DATE,
  },
  paused_at: {
    type: DataTypes.DATE,
  },
  max_sales_discount_percent: {
    type: DataTypes.DECIMAL,
  },
  allow_login: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "terminated"),
    allowNull: false,
    defaultValue: "active",
  },
  is_enable_service_staff_pin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  service_staff_pin: {
    type: DataTypes.TEXT,
  },
  crm_contact_id: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  is_cmmsn_agnt: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cmmsn_percent: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.0,
  },
  selected_contacts: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  gender: {
    type: DataTypes.STRING,
  },
  marital_status: {
    type: DataTypes.ENUM("married", "unmarried", "divorced"),
  },
  blood_group: {
    type: DataTypes.STRING,
  },
  contact_number: {
    type: DataTypes.STRING,
  },
  alt_number: {
    type: DataTypes.STRING,
  },
  family_number: {
    type: DataTypes.STRING,
  },
  fb_link: {
    type: DataTypes.STRING,
  },
  twitter_link: {
    type: DataTypes.STRING,
  },
  social_media_1: {
    type: DataTypes.STRING,
  },
  social_media_2: {
    type: DataTypes.STRING,
  },
  permanent_address: {
    type: DataTypes.TEXT,
  },
  current_address: {
    type: DataTypes.TEXT,
  },
  guardian_name: {
    type: DataTypes.STRING,
  },
  custom_field_1: {
    type: DataTypes.STRING,
  },
  custom_field_2: {
    type: DataTypes.STRING,
  },
  custom_field_3: {
    type: DataTypes.STRING,
  },
  custom_field_4: {
    type: DataTypes.STRING,
  },
  bank_details: {
    type: DataTypes.TEXT,
  },
  id_proof_name: {
    type: DataTypes.STRING,
  },
  id_proof_number: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: "User",
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,
  deletedAt: "deleted_at",
});

export default User;
