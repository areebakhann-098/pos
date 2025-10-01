import { DataTypes, DATEONLY } from "sequelize";
import { sequelize } from "../config/db.js";

const Purchase = sequelize.define(
  "Purchase",
  {
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     discount_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
   
    reference_number: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    purchase_date: {
      type: DATEONLY,
      allowNull: false,
    },
    purchase_status: {
      type: DataTypes.ENUM("pending", "ordered"),  
    },
    bussiness_location_id: {
      type: DataTypes.INTEGER,  
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    additional_notes: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    total_paid_amount: {
      type: DataTypes.DECIMAL,  
      allowNull: false,
    },
    date_paid_on: {
      type: DATEONLY,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "credit", "bank_transfer"),
    },
     total_amount: {
      type: DataTypes.DECIMAL,  
      allowNull: false,
    },
    quantity: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 0,
},

  },
  {
    sequelize,
    modelName: "Purchase",
    tableName: "purchases",
    timestamps: true,
    paranoid: true,
  }
);

export default Purchase;
 