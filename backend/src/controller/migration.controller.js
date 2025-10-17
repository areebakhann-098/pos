import {
  Migration,
  BusinessLocation,
} from "../model/migration.associations.js";
import Products from "../model/products.model.js";
import { Op } from "sequelize";
import Price from "../model/price.model.js";

export const createMigration = async (req, res) => {
  const t = await Migration.sequelize.transaction();

  try {
    const {
      from_location_id,
      to_location_id,
      reference_no,
      date,
      shipment_charges,
      additional_notes,
      products,
      total_amount
    } = req.body;

    // ✅ Validation
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required for migration",
      });
    }

    const createdMigrations = [];

    // ✅ Loop through each product
    for (const item of products) {
      // ✅ 1️⃣ Find product in DB
      const dbProduct = await Products.findByPk(item.product_id);

      if (!dbProduct) {
        throw new Error(`Product not found with ID: ${item.product_id}`);
      }

      // ✅ 2️⃣ Check if enough stock available
      if (dbProduct.quantity < item.quantity) {
        throw new Error(
          `Not enough stock for product: ${dbProduct.product_name}. Available: ${dbProduct.quantity}, Required: ${item.quantity}`
        );
      }

      // ✅ 3️⃣ Create migration entry
      const migration = await Migration.create(
        {
          from_location_id,
          to_location_id,
          product_id: item.product_id,
          quantity: item.quantity,
          reference_no,
          date,
          shipment_charges,
          additional_notes,
          total_amount
        },
        { transaction: t }
      );

      // ✅ 4️⃣ Subtract quantity from Products stock
      dbProduct.quantity -= item.quantity;
      await dbProduct.save({ transaction: t });

      createdMigrations.push(migration);
    }

    // ✅ Commit transaction if all good
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Migration created successfully and stock updated",
      data: createdMigrations,
    });
  } catch (error) {
    // ❌ Rollback transaction on failure
    await t.rollback();
    console.error("❌ Migration creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating migration",
      error: error.message,
    });
  }
};

// ✅ Get All Migrations
export const getMigrations = async (req, res) => {
  try {
    const migrations = await Migration.findAll({
      include: [
        {
          model: BusinessLocation,
          as: "fromLocation",
          attributes: ["id", "name"],
        },
        {
          model: BusinessLocation,
          as: "toLocation",
          attributes: ["id", "name"],
        },
        {
          model: Products,
          as: "product",
          attributes: ["id", "product_name"],
          include: [
            {
              model: Price,
              as: "price",
              attributes: ["id", "purchase_price"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: migrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching migrations",
      error: error.message,
    });
  }
};

// ✅ Get Migration by ID
export const getMigrationById = async (req, res) => {
  try {
    const migration = await Migration.findByPk(req.params.id, {
      include: [
        {
          model: BusinessLocation,
          as: "fromLocation",
          attributes: ["id", "name"],
        },
        {
          model: BusinessLocation,
          as: "toLocation",
          attributes: ["id", "name"],
        },
        {
          model: Products,
          as: "product",
          attributes: ["id", "product_name"],
          include: [
            {
              model: Price,
              as: "price",
              attributes: ["id", "purchase_price"],
            },
          ],
        },
      ],
    });

    if (!migration) {
      return res.status(404).json({
        success: false,
        message: "Migration not found",
      });
    }

    res.status(200).json({
      success: true,
      data: migration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching migration",
      error: error.message,
    });
  }
};

// ✅ Update Migration
export const updateMigration = async (req, res) => {
  try {
    const migration = await Migration.findByPk(req.params.id);
    if (!migration) {
      return res.status(404).json({
        success: false,
        message: "Migration not found",
      });
    }

    await migration.update(req.body);

    res.status(200).json({
      success: true,
      message: "Migration updated successfully",
      data: migration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating migration",
      error: error.message,
    });
  }
};

// ✅ Delete Migration
export const deleteMigration = async (req, res) => {
  try {
    const migration = await Migration.findByPk(req.params.id);
    if (!migration) {
      return res.status(404).json({
        success: false,
        message: "Migration not found",
      });
    }

    await migration.destroy();

    res.status(200).json({
      success: true,
      message: "Migration deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting migration",
      error: error.message,
    });
  }
};

// ✅ Search Migrations by Product Name or Reference No
export const searchMigrations = async (req, res) => {
  try {
    const { q } = req.query;

    // ✅ Validate query
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const searchTerm = q.trim().toLowerCase();

    // ✅ Search products with price
    const products = await Products.findAll({
      where: {
        product_name: { [Op.iLike]: `%${searchTerm}%` }, // case-insensitive match
      },
      include: [
        {
          model: Price,
          as: "price", // ✅ alias must match your association
          attributes: ["purchase_price"],
        },
      ],
      attributes: ["id", "product_name"],
      limit: 10,
    });
    // ✅ Return results
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("❌ Search Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
