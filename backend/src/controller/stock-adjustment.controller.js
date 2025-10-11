import StockAdjustment from "../model/stock-adjustment.model.js";
import Products from "../model/products.model.js";
import Price from "../model/price.model.js";
import Contact from "../model/contact.model.js";
import BusinessLocation from "../model/business-location.model.js";

// ✅ Create Stock Adjustment
export const createStockAdjustment = async (req, res) => {
  try {
    const {
      contact_id,
      BusinessLocation_id,
      reference,
      date,
      adjustment_type,
      product_id,
      quantity,
      recovery_amount,
      reason,
    } = req.body;

    // 🔹 Product + Price include
    const product = await Products.findByPk(product_id, {
      include: [{ model: Price, as: "price" }],
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 🔹 Stock check
    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock available" });
    }

    // 🔹 Purchase price
    const purchasePrice = product.price?.purchase_price || 0;
    const totalAccount = purchasePrice * quantity;

    // 🔹 Update stock
    product.quantity -= quantity;
    await product.save();

    // 🔹 Save adjustment
    const adjustment = await StockAdjustment.create({
      contact_id,
      BusinessLocation_id,
      reference,
      date,
      adjustment_type,
      product_id,
      quantity,
      recovery_amount,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Stock adjustment created successfully",
      data: {
        adjustment,
        product: {
          id: product.id,
          product_name: product.product_name,
          quantity: product.quantity,
        },
        purchase_price: purchasePrice,
        total_account: totalAccount,
      },
    });
  } catch (error) {
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
          attributes: ["id", "product_name", "quantity"],
        },
         {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name"],
        },
        {
          model: Contact,
          as: "contacts",
          attributes: ["id", "first_name", "middle_name", "last_name", "supplier_business_name"],
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
          attributes: ["id", "product_name", "quantity"],
        },
        {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name"],
        },
        {
          model: Contact,
          as: "contacts",
          attributes: ["id", "first_name", "middle_name", "last_name", "supplier_business_name"],
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

// ✅ Update stock adjustment
export const updateStockAdjustment = async (req, res) => {
  try {
    const {
      contact_id,
      BusinessLocation_id,
      reference,
      date,
      adjustment_type,
      product_id,
      quantity,
      recovery_amount,
      reason,
    } = req.body;

    const adjustment = await StockAdjustment.findByPk(req.params.id);
    if (!adjustment) {
      return res
        .status(404)
        .json({ success: false, message: "Stock Adjustment not found" });
    }

    const product = await Products.findByPk(product_id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 🔹 Rollback old stock
    product.quantity += adjustment.quantity;

    // 🔹 Check new quantity
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
      BusinessLocation_id,
      reference,
      date,
      adjustment_type,
      product_id,
      quantity,
      recovery_amount,
      reason,
    });

    res.json({
      success: true,
      message: "Stock adjustment updated successfully",
      data: {
        adjustment,
        product: {
          id: product.id,
          product_name: product.product_name,
          quantity: product.quantity,
        },
      },
    });
  } catch (error) {
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
