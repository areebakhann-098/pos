// controllers/purchase.controller.js
import Purchase from "../model/purchase.model.js";
import Products from "../model/products.model.js";
import BusinessLocation from "../model/business-location.model.js";
import Contact from "../model/contact.model.js";
import Discount from "../model/discount.model.js";
import Price from "../model/price.model.js";

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

    // 🔹 Step 1: Purchase create karo
    const purchase = await Purchase.create(body);

    // 🔹 Step 2: Product ki quantity increase karo
    const product = await Products.findByPk(body.product_id);
    if (product) {
      product.quantity = (product.quantity || 0) + (body.quantity || 0); // purchase quantity add hogi
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Purchase created successfully & Product stock updated",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    console.log(error)
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
          attributes: ["id", "product_name", ],
          include: [
            {
              model: Price,
              as: "price", // ✅ association name jo defineAssociations me banaya tha
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

    if (!purchase) {
      return res.status(404).json({ success: false, error: "Purchase not found" });
    }

    // ✅ purchase price extract karne ka simple way
    const responseData = {
      ...purchase.toJSON(),
      purchase_price: purchase.product?.price?.purchase_price || null,
    };

    res.json({ success: true, data: responseData });
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
