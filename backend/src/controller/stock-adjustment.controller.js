import StockAdjustment from "../model/stock-adjustment.model.js";
import Products from "../model/products.model.js";
import Price from "../model/price.model.js";
import Contact from "../model/contact.model.js";
import BusinessLocation from "../model/business-location.model.js";
import { Op } from "sequelize";
import { sequelize } from "../config/db.js"; // <-- Add this

// ✅ Create Stock Adjustment
export const createStockAdjustment = async (req, res) => {
  const t = await sequelize.transaction(); // transaction
  try {
    const {
      contact_id,
      business_location,
      reference_no,
      adjustment_date,
      adjustment_type,
      reason,
      products,
    } = req.body;
console.log(req.body)
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products provided" });
    }

    const savedAdjustments = [];
    let totalRecovered = 0;

    for (let item of products) {
      const { product_id, quantity, unit_cost } = item;

      const product = await Products.findByPk(product_id, {
        include: [{ model: Price, as: "price" }],
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ID ${product_id} not found`,
        });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ID ${product_id}`,
        });
      }

      // Deduct stock
      product.quantity -= quantity;
      await product.save({ transaction: t });

      const recovery_amount = unit_cost * quantity;
      totalRecovered += recovery_amount;

      const adjustment = await StockAdjustment.create(
        {
          contact_id,
          BusinessLocation_id: business_location,
          reference: reference_no,
          date: adjustment_date,
          adjustment_type,
          product_id,
          quantity,
          recovery_amount,
          reason,
        },
        { transaction: t }
      );

      savedAdjustments.push({
        adjustment,
        product: {
          id: product.id,
          product_name: product.product_name,
          remaining_stock: product.quantity,
        },
        unit_cost,
        line_total: recovery_amount,
      });
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Stock adjustment created successfully",
      data: { total_recovered: totalRecovered, adjustments: savedAdjustments },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating stock adjustment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get all adjustments with product info
export const getAllStockAdjustments = async (req, res) => {
  try {
    const adjustments = await StockAdjustment.findAll({
      include: [
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
        {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name"],
        },
        {
          model: Contact,
          as: "contacts",
          attributes: [
            "id",
            "first_name",
            "middle_name",
            "last_name",
            "supplier_business_name",
          ],
        },
      ],
    });
    res.json({ success: true, data: adjustments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single adjustment
export const getStockAdjustmentById = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findByPk(req.params.id, {
      include: [
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
        {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name"],
        },
        {
          model: Contact,
          as: "contacts",
          attributes: [
            "id",
            "first_name",
            "middle_name",
            "last_name",
            "supplier_business_name",
          ],
        },
      ],
    });
    if (!adjustment) {
      return res
        .status(404)
        .json({ success: false, message: "Stock Adjustment not found" });
    }
    res.json({ success: true, data: adjustment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStockAdjustment = async (req, res) => {
  try {
    const {
      contact_id,
      business_location,
      reference,
      adjustment_date,
      adjustment_type,
      reason,
      products,
    } = req.body;

    console.log("🧾 Update payload:", req.body);

    // ✅ Take the first product from array
    const firstProduct = products && products[0];
    if (!firstProduct) {
      return res.status(400).json({ success: false, message: "No product provided" });
    }

    const { product_id, quantity, unit_cost } = firstProduct;

    // ✅ Find adjustment record
    const adjustment = await StockAdjustment.findByPk(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ success: false, message: "Stock Adjustment not found" });
    }

    // ✅ Find product
    const product = await Products.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 🔹 Rollback old quantity
    product.quantity += adjustment.quantity;

    // 🔹 Validate new stock
    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock available" });
    }

    // 🔹 Apply new adjustment
    product.quantity -= quantity;
    await product.save();

    // 🔹 Update adjustment record
    await adjustment.update({
      contact_id,
      business_location,
      reference,
      adjustment_date,
      adjustment_type,
      product_id,
      quantity,
      unit_cost,
      reason,
    });

    res.json({
      success: true,
      message: "✅ Stock adjustment updated successfully",
      data: {
        adjustment,
        product: {
          id: product.id,
          name: product.product_name,
          quantity: product.quantity,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error updating stock adjustment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Delete stock adjustment (rollback stock)
export const deleteStockAdjustment = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findByPk(req.params.id);
    if (!adjustment) {
      return res
        .status(404)
        .json({ success: false, message: "Stock Adjustment not found" });
    }

    const product = await Products.findByPk(adjustment.product_id);
    if (product) {
      product.quantity += adjustment.quantity; // rollback stock
      await product.save();
    }

    await adjustment.destroy();

    res.json({
      success: true,
      message: "Stock adjustment deleted and stock rolled back",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Search Products for Stock Adjustment
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const searchTerm = q.trim().toLowerCase();

    const products = await Products.findAll({
      where: {
        product_name: { [Op.iLike]: `%${searchTerm}%` }, // case-insensitive
      },
      include: [
        {
          model: Price,
          as: "price",
          attributes: ["purchase_price"],
        },
      ],
      attributes: ["id", "product_name", "quantity"],
      limit: 10,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
