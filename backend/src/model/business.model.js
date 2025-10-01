// models/business.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
    },
    tax_number_1: {
      type: DataTypes.STRING,
    },
    tax_label_1: {
      type: DataTypes.STRING,
    },
    tax_number_2: {
      type: DataTypes.STRING,
    },
    tax_label_2: {
      type: DataTypes.STRING,
    },
    code_label_1: {
      type: DataTypes.STRING,
    },
    code_1: {
      type: DataTypes.STRING,
    },
    code_label_2: {
      type: DataTypes.STRING,
    },
    code_2: {
      type: DataTypes.STRING,
    },
    default_sales_tax: {
      type: DataTypes.INTEGER,
    },
    default_profit_percent: {
      type: DataTypes.DOUBLE(5, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_zone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Asia/Kolkata",
    },
    fy_start_month: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
    accounting_method: {
      type: DataTypes.ENUM("fifo", "lifo", "avco"),
      allowNull: false,
      defaultValue: "fifo",
    },
    default_sales_discount: {
      type: DataTypes.DECIMAL(5, 2),
    },
    sell_price_tax: {
      type: DataTypes.ENUM("includes", "excludes"),
      allowNull: false,
      defaultValue: "includes",
    },
    logo: {
      type: DataTypes.STRING,
    },
    sku_prefix: {
      type: DataTypes.STRING,
    },
    enable_product_expiry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expiry_type: {
      type: DataTypes.ENUM("add_expiry", "add_manufacturing"),
      allowNull: false,
      defaultValue: "add_expiry",
    },
    on_product_expiry: {
      type: DataTypes.ENUM("keep_selling", "stop_selling", "auto_delete"),
      allowNull: false,
      defaultValue: "keep_selling",
    },
    stop_selling_before: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enable_tooltip: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    purchase_in_diff_currency: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    purchase_currency_id: {
      type: DataTypes.INTEGER,
    },
    p_exchange_rate: {
      type: DataTypes.DECIMAL(20, 3),
      allowNull: false,
      defaultValue: 1.0,
    },
    transaction_edit_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    stock_expiry_alert_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    keyboard_shortcuts: {
      type: DataTypes.TEXT,
    },
    pos_settings: {
      type: DataTypes.TEXT,
    },
    weighing_scale_setting: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    enable_brand: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enable_category: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enable_sub_category: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enable_price_tax: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enable_purchase_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    enable_lot_number: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    default_unit: {
      type: DataTypes.INTEGER,
    },
    enable_sub_units: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    enable_racks: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    enable_row: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    enable_position: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    enable_editing_product_from_purchase: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sales_cmsn_agnt: {
      type: DataTypes.ENUM("logged_in_user", "user", "cmsn_agnt"),
    },
    item_addition_method: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enable_inline_tax: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    currency_symbol_placement: {
      type: DataTypes.ENUM("before", "after"),
      allowNull: false,
      defaultValue: "before",
    },
    enabled_modules: {
      type: DataTypes.TEXT,
    },
    date_format: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "m/d/Y",
    },
    time_format: {
      type: DataTypes.ENUM("12", "24"),
      allowNull: false,
      defaultValue: "24",
    },
    currency_precision: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 2,
    },
    quantity_precision: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 2,
    },
    ref_no_prefixes: {
      type: DataTypes.TEXT,
    },
    theme_color: {
      type: DataTypes.STRING,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    enable_rp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    rp_name: {
      type: DataTypes.STRING,
    },
    amount_for_unit_rp: {
      type: DataTypes.DECIMAL(22, 4),
      allowNull: false,
      defaultValue: 1.0,
    },
    min_order_total_for_rp: {
      type: DataTypes.DECIMAL(22, 4),
      allowNull: false,
      defaultValue: 1.0,
    },
    max_rp_per_order: {
      type: DataTypes.INTEGER,
    },
    redeem_amount_per_unit_rp: {
      type: DataTypes.DECIMAL(22, 4),
      allowNull: false,
      defaultValue: 1.0,
    },
    min_order_total_for_redeem: {
      type: DataTypes.DECIMAL(22, 4),
      allowNull: false,
      defaultValue: 1.0,
    },
    min_redeem_point: {
      type: DataTypes.INTEGER,
    },
    max_redeem_point: {
      type: DataTypes.INTEGER,
    },
    rp_expiry_period: {
      type: DataTypes.INTEGER,
    },
    rp_expiry_type: {
      type: DataTypes.ENUM("month", "year"),
      allowNull: false,
      defaultValue: "year",
    },
    email_settings: {
      type: DataTypes.TEXT,
    },
    sms_settings: {
      type: DataTypes.TEXT,
    },
    custom_labels: {
      type: DataTypes.TEXT,
    },
    common_settings: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Business",
    tableName: "business",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // consistency with Contact/Booking
    deletedAt: "deleted_at",
  }
);

export default Business;
