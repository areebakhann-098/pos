// controllers/sales.controller.js
import Sale from "../model/sale.model.js";
import Contact from "../model/contact.model.js";
import BusinessLocation from "../model/business-location.model.js";
import Discount from "../model/discount.model.js";
import TaxRate from "../model/tax-rate.model.js";
import Products from "../model/products.model.js";

// =============================
// CREATE SALE (with stock update)
// =============================
export const createSale = async (req, res) => {
  const t = await Sale.sequelize.transaction(); // transaction start
  try {
    const {
      invoice_no,
      sale_date,
      customer_id,
      business_location_id,
      total_items,
      total_amount,
      discount_id,
      tax_id,
      final_amount,
      payment_status,
      payment_method,
      amount_paid,
      notes,
      product_id
    } = req.body;

    // ✅ 1. Product check
    const product = await Products.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    // ✅ 2. Stock check
    if (product.quantity < total_items) {
      return res.status(400).json({ success: false, error: "Not enough stock available" });
    }

    // ✅ 3. Create sale
    const sale = await Sale.create({
      invoice_no,
      sale_date,
      customer_id,
      business_location_id,
      total_items,
      total_amount,
      discount_id,
      tax_id,
      final_amount,
      payment_status,
      payment_method,
      amount_paid,
      notes,
      product_id
    }, { transaction: t });

    // ✅ 4. Update stock
    product.quantity -= total_items;
    await product.save({ transaction: t });

    await t.commit();

    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    await t.rollback();
    console.error("❌ Error creating sale:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================
// GET ALL SALES
// =============================
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: Contact, as: "customer" },
        { model: BusinessLocation, as: "businessLocation" },
        { model: Discount, as: "discount" },
        { model: TaxRate, as: "tax" },
        { model: Products, as: "product" },
      ],
    });

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("❌ Error fetching sales:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================
// GET SALE BY ID
// =============================
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id, {
      include: [
        { model: Contact, as: "customer" },
        { model: BusinessLocation, as: "businessLocation" },
        { model: Discount, as: "discount" },
        { model: TaxRate, as: "tax" },
        { model: Products, as: "product" },
      ],
    });

    if (!sale) {
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    console.error("❌ Error fetching sale:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================
// UPDATE SALE
// =============================
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sale = await Sale.findByPk(id);
    if (!sale) {
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    await sale.update(updateData);

    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    console.error("❌ Error updating sale:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================
// DELETE SALE
// =============================
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id);
    if (!sale) {
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    await sale.destroy();

    res.status(200).json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting sale:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
