// models/transaction.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_id: DataTypes.INTEGER,
    is_kitchen_order: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    res_table_id: DataTypes.INTEGER,
    res_waiter_id: DataTypes.INTEGER,
    res_order_status: {
      type: DataTypes.ENUM("received", "cooked", "served"),
    },
    type: DataTypes.STRING(191),
    sub_type: DataTypes.STRING(20),
    status: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    sub_status: DataTypes.STRING(191),
    is_quotation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    payment_status: {
      type: DataTypes.ENUM("paid", "due", "partial"),
    },
    adjustment_type: {
      type: DataTypes.ENUM("normal", "abnormal"),
    },
    contact_id: DataTypes.INTEGER,
    customer_group_id: DataTypes.INTEGER,
    invoice_no: DataTypes.STRING(191),
    ref_no: DataTypes.STRING(191),
    source: DataTypes.STRING(191),
    subscription_no: DataTypes.STRING(191),
    subscription_repeat_on: DataTypes.STRING(191),
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_before_tax: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    tax_id: DataTypes.INTEGER,
    tax_amount: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    discount_type: {
      type: DataTypes.ENUM("fixed", "percentage"),
    },
    discount_amount: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    rp_redeemed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rp_redeemed_amount: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    shipping_details: DataTypes.STRING(191),
    shipping_address: DataTypes.TEXT,
    delivery_date: DataTypes.DATE,
    shipping_status: DataTypes.STRING(191),
    delivered_to: DataTypes.STRING(191),
    delivery_person: DataTypes.BIGINT,
    shipping_charges: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    shipping_custom_field_1: DataTypes.STRING(191),
    shipping_custom_field_2: DataTypes.STRING(191),
    shipping_custom_field_3: DataTypes.STRING(191),
    shipping_custom_field_4: DataTypes.STRING(191),
    shipping_custom_field_5: DataTypes.STRING(191),
    additional_notes: DataTypes.TEXT,
    staff_note: DataTypes.TEXT,
    is_export: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    export_custom_fields_info: DataTypes.TEXT, // ✅ fixed: removed ("long")
    round_off_amount: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    additional_expense_key_1: DataTypes.STRING(191),
    additional_expense_value_1: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    additional_expense_key_2: DataTypes.STRING(191),
    additional_expense_value_2: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    additional_expense_key_3: DataTypes.STRING(191),
    additional_expense_value_3: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    additional_expense_key_4: DataTypes.STRING(191),
    additional_expense_value_4: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    final_total: {
      type: DataTypes.DECIMAL(22, 4),
      defaultValue: 0.0,
    },
    expense_category_id: DataTypes.INTEGER,
    expense_sub_category_id: DataTypes.INTEGER,
    expense_for: DataTypes.INTEGER,
    commission_agent: DataTypes.INTEGER,
    document: DataTypes.STRING(191),
    is_direct_sale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_suspend: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(20, 3),
      defaultValue: 1.0,
    },
    total_amount_recovered: DataTypes.DECIMAL(22, 4),
    transfer_parent_id: DataTypes.INTEGER,
    return_parent_id: DataTypes.INTEGER,
    opening_stock_product_id: DataTypes.INTEGER,
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_requisition_ids: DataTypes.TEXT,
    prefer_payment_method: DataTypes.STRING(191),
    prefer_payment_account: DataTypes.INTEGER,
    sales_order_ids: DataTypes.TEXT,
    purchase_order_ids: DataTypes.TEXT,
    custom_field_1: DataTypes.STRING(191),
    custom_field_2: DataTypes.STRING(191),
    custom_field_3: DataTypes.STRING(191),
    custom_field_4: DataTypes.STRING(191),
    import_batch: DataTypes.INTEGER,
    import_time: DataTypes.DATE,
    types_of_service_id: DataTypes.INTEGER,
    packing_charge: DataTypes.DECIMAL(22, 4),
    packing_charge_type: {
      type: DataTypes.ENUM("fixed", "percent"),
    },
    service_custom_field_1: DataTypes.TEXT,
    service_custom_field_2: DataTypes.TEXT,
    service_custom_field_3: DataTypes.TEXT,
    service_custom_field_4: DataTypes.TEXT,
    service_custom_field_5: DataTypes.TEXT,
    service_custom_field_6: DataTypes.TEXT,
    is_created_from_api: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rp_earned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    order_addresses: DataTypes.TEXT,
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recur_interval: DataTypes.DOUBLE, // ✅ allowed in Postgres
    recur_interval_type: {
      type: DataTypes.ENUM("days", "months", "years"),
    },
    recur_repetitions: DataTypes.INTEGER,
    recur_stopped_on: DataTypes.DATE,
    recur_parent_id: DataTypes.INTEGER,
    invoice_token: DataTypes.STRING(191),
    pay_term_number: DataTypes.INTEGER,
    pay_term_type: {
      type: DataTypes.ENUM("days", "months"),
    },
    selling_price_group_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Transaction;
