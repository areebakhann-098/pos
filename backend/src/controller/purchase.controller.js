// controllers/purchase.controller.js
import Purchase from "../model/purchase.model.js";
import Products from "../model/products.model.js";
import BusinessLocation from "../model/business-location.model.js";
import Contact from "../model/contact.model.js";
import Discount from "../model/discount.model.js";


// 🔹 Helper: validate FK existence
const ensureExists = async (Model, id, fieldName) => {
  if (id === undefined || id === null) return;
  const rec = await Model.findByPk(id);
  if (!rec) throw new Error(`Invalid ${fieldName}: record with id ${id} not found`);
};

// ✅ Create a new purchase
export const createPurchase = async (req, res) => {
  try {
    const body = req.body;

    // foreign keys validate karo
    await ensureExists(Products, body.product_id, "product_id");
    await ensureExists(BusinessLocation, body.bussiness_location_id, "bussiness_location_id");
    await ensureExists(Contact, body.contact_id, "contact_id");
    await ensureExists(Discount, body.discount_id, "discount_id");

    const purchase = await Purchase.create(body);
    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
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
          attributes: ["id", "product_name", "quantity"],
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
                    attributes: ["id", "discount_type", "discount_amount"]
                   }, 

      ],
    });
    res.json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get a single purchase by ID with relations
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: [
        {
          model: Products,
          as: "product",
          attributes: ["id", "product_name", "quantity"], // ✅ fixed
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
                    attributes: ["id", "discount_type", "discount_amount"]
                   }, 

      ],
    });

    if (!purchase) {
      return res.status(404).json({ success: false, error: "Purchase not found" });
    }
    res.json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ Update purchase
export const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) {
      return res.status(404).json({ success: false, error: "Purchase not found" });
    }

    const body = req.body;

    // validate foreign keys if present
    await ensureExists(Products, body.product_id, "product_id");
    await ensureExists(BusinessLocation, body.bussiness_location_id, "bussiness_location_id");
    await ensureExists(Contact, body.contact_id, "contact_id");

    await purchase.update(body);
    res.json({ success: true, message: "Purchase updated successfully", data: purchase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ✅ Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) {
      return res.status(404).json({ success: false, error: "Purchase not found" });
    }

    await purchase.destroy();
    res.json({ success: true, message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
