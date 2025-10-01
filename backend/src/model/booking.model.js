// models/booking.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    contact_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    waiter_id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    table_id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    correspondent_id: {
      type: DataTypes.INTEGER,
    },
    business_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    booking_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    booking_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    booking_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    booking_note: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // soft delete
    deletedAt: "deleted_at",
  }
);

export default Booking;
