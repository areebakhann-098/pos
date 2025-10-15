// controllers/purchase.controller.js
import Purchase from "../model/purchase.model.js";
import Products from "../model/products.model.js";
import BusinessLocation from "../model/business-location.model.js";
import Contact from "../model/contact.model.js";
import Discount from "../model/discount.model.js";
import Price from "../model/price.model.js";
import { Op, fn, col, where } from "sequelize";
import { sequelize } from "../config/db.js"; 
// 🔹 Helper: validate FK existence
const ensureExists = async (Model, id, fieldName) => {
  if (!id) throw new Error(`${fieldName} is required`);
  const record = await Model.findByPk(id);
  if (!record) throw new Error(`${fieldName} not found`);
};

// ✅ Create multiple purchases in one request
export const createPurchase = async (req, res) => {
  try {
    const body = req.body;
    console.log( body)
if (!body.products && body.product_id) {
  body.products = [
    {
      product_id: body.product_id,
      quantity: body.quantity,
      discount_id: body.discount_id,
      total_amount: body.total_amount,
      purchase_price: body.price,
    },
  ];
}
    // 🔸 Validate foreign keys
    await ensureExists(BusinessLocation, body.bussiness_location_id, "bussiness_location_id");
    await ensureExists(Contact, body.contact_id, "contact_id");

    // 🔸 Validate products array
    const { products } = body;
    if (!Array.isArray(products) || products.length === 0)
      return res.status(400).json({ success: false, error: "Products array is required" });

    const createdPurchases = [];

    // 🔹 Create purchase for each product
    for (const item of products) {
      const product = await Products.findByPk(item.product_id);
      if (!product) throw new Error(`Product with ID ${item.product_id} not found`);

      const purchase = await Purchase.create({
        contact_id: body.contact_id,
    discount_id: item.discount_id || 0, // ✅ use per-item discount
        reference_number: body.reference_number,
        purchase_date: body.purchase_date,
        purchase_status: body.purchase_status || "pending",
        bussiness_location_id: body.bussiness_location_id,
        additional_notes: body.additional_notes,
        total_paid_amount: body.total_paid_amount,
        date_paid_on: body.date_paid_on,
        payment_method: body.payment_method,
        total_amount: item.total_amount || item.quantity * item.purchase_price,
        quantity: item.quantity,
        product_id: item.product_id,
      });

      createdPurchases.push(purchase);

      // 🔸 Update stock
      product.quantity = (product.quantity || 0) + item.quantity;
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "✅ Purchases created successfully & product stock updated",
      data: createdPurchases,
    });
  } catch (error) {
    console.error("❌ Error creating purchases:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ✅ Get all purchases with relations
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        {
          model: Products,
          as: "product",
          attributes: ["id", "product_name"],
        },
        {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name", "city", "country"],
        },
        {
          model: Contact,
          as: "contact",
          attributes: ["id", "first_name", "middle_name", "last_name", "city", "state", "country"],
        },
        {
          model: Discount,
          as: "discount",
          attributes: ["id", "name", "discount_amount"],
        },
      ],
      
    });
    res.json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get a single purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
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
          attributes: ["id", "name", "city", "country"],
        },
        {
          model: Contact,
          as: "contact",
          attributes: ["id", "first_name", "middle_name", "last_name", "city", "state", "country"],
        },
        {
          model: Discount,
          as: "discount",
          attributes: ["id", "discount_type", "discount_amount"],
        },
      ],
    });

    if (!purchase)
      return res.status(404).json({ success: false, error: "Purchase not found" });

    const responseData = {
      ...purchase.toJSON(),
      purchase_price: purchase.product?.price?.purchase_price || null,
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase)
      return res.status(404).json({ success: false, error: "Purchase not found" });

    const body = req.body;

    // ✅ Validate foreign keys
    await ensureExists(Products, body.product_id, "product_id");
    await ensureExists(BusinessLocation, body.bussiness_location_id, "bussiness_location_id");
    await ensureExists(Contact, body.contact_id, "contact_id");

    // ✅ Find product related to this purchase
    const product = await Products.findByPk(body.product_id);
    if (!product) throw new Error("Product not found");

    // ✅ Adjust product stock based on quantity difference
    const oldQty = purchase.quantity || 0;
    const newQty = body.quantity || 0;

    if (newQty !== oldQty) {
      const difference = newQty - oldQty; // can be + or -
      product.quantity = (product.quantity || 0) + difference;
      await product.save();
      console.log(`📦 Product stock updated: ${oldQty} → ${newQty} (diff ${difference})`);
    }

    // ✅ Update purchase record
    await purchase.update(body);

    res.json({
      success: true,
      message: "✅ Purchase updated successfully & stock adjusted",
      data: purchase,
    });
  } catch (error) {
    console.error("❌ Error updating purchase:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};


// ✅ Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase)
      return res.status(404).json({ success: false, error: "Purchase not found" });

    await purchase.destroy();
    res.json({ success: true, message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
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

    // ✅ Sequelize search with association
    const products = await Products.findAll({
      where: {
        product_name: { [Op.iLike]: `%${searchTerm}%` }, // case-insensitive search
      },
      include: [
        {
          model: Price,
          as: "price",
          attributes: ["purchase_price"],
        },
      ],
      attributes: ["id", "product_name",],
      limit: 10,
    });

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