// controllers/product.controller.js
import BusinessLocation from "../model/business-location.model.js";
import  Brand  from "../model/brand.model.js";
import  Unit  from "../model/unit.model.js";
import Products from "../model/products.model.js";
import {
  Warranty,
  Category,
  TaxRate,
  Variation,
  Price,
  VariationValue,
} from "../model/pos.association.js"; // adjust path
import { Op } from "sequelize";
// helper: validate FK existence

const ensureExists = async (Model, id, fieldName) => {
  if (id === undefined || id === null) return;
  const rec = await Model.findByPk(id);
  if (!rec)
    throw new Error(`Invalid ${fieldName}: record with id ${id} not found`);
};

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    console.log("Product Body Received:", req.body);

    // validate required FKs
    await ensureExists(Warranty, body.warranty_id, "warranty_id");
    await ensureExists(Category, body.category_id, "category_id");
    await ensureExists(Brand, body.brands_id, "brands_id");
    await ensureExists(Unit, body.unit_id, "unit_id");
    await ensureExists(Variation, body.variation_id, "variation_id");
    await ensureExists(TaxRate, body.tax_rate_id, "tax_rate_id");
    await ensureExists(
      BusinessLocation,
      body.business_location_id,
      "business_location_id"
    );

    // ✅ pehle price insert karo
    const priceData = {
      profit_percent: body.profit_percent,
      purchase_price: body.purchase_price,
      sell_price: body.sell_price,
      sell_price_with_tax: body.sell_price_with_tax,
    };

    const price = await Price.create(priceData);

    // ✅ ab product create karo
    const product = await Products.create({
      ...body,
      price_id: price.id, // link
    });

    return res.status(201).json({
      success: true,
      message: "Product created with price",
      data: { product, price },
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: [
        "id",
        "product_name",
        "product_description",
        "weight",
        "quantity",
        "expiry_date",
      ],
      include: [
        { model: Warranty, as: "warranty", attributes: ["id", "name"] },
        { model: Category, as: "Category", attributes: ["id", "name","sub_category"] },
        { model: TaxRate, as: "taxRate", attributes: ["id", "name", "amount"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: Unit, as: "unit", attributes: ["id", "name"] },
        {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name", "city", "country"],
        },
        {
          model: Variation,
          as: "variation",
          attributes: ["id", "variation_name", ],
              include: [
            {
              model: VariationValue,
              as: "values",
              attributes: ["id", "value_name"],
            },
          ],
        },
        {
          model: Price,
          as: "price",
          attributes: ["id", "purchase_price", "sell_price","profit_percent"],
        },
      ],
    });

    return res.json({ success: true, data: products });
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id, {
      attributes: [
        "id",
        "product_name",
        "product_description",
        "weight",
        "quantity",
        "expiry_date",
      ],
    include: [
        { model: Warranty, as: "warranty", attributes: ["id", "name"] },
        { model: Category, as: "Category", attributes: ["id", "name","sub_category"] },
        { model: TaxRate, as: "taxRate", attributes: ["id", "name", "amount"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: Unit, as: "unit", attributes: ["id", "name"] },
        {
          model: BusinessLocation,
          as: "businessLocation",
          attributes: ["id", "name", "city", "country"],
        },
        {
          model: Variation,
          as: "variation",
          // attributes: ["id", "variation_name", "variation_value"],
        },
       {
          model: Price,
          as: "price",
          attributes: ["id", "purchase_price", "sell_price","profit_percent"],
        },
      ],
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id);
   
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const body = req.body;
    await ensureExists(Warranty, body.warranty_id, "warranty_id");
    await ensureExists(Category, body.category_id, "category_id");
    await ensureExists(Brand, body.brands_id, "brands_id");
    await ensureExists(Unit, body.unit_id, "unit_id");
    await ensureExists(Variation, body.variation_id, "variation_id");
    await ensureExists(TaxRate, body.tax_rate_id, "tax_rate_id");
    await ensureExists(Price, body.price_id, "price_id");

    await product.update(body);
    return res.json({
      success: true,
      message: "Product updated",
      data: product,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await product.destroy();
    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const searchProductsByCategory = async (req, res) => {
  try {
    const { q } = req.query;

    console.log("🔍 Received Query:", q);

    if (!q || q.trim() === "") {
      console.log("⚠️ Empty search term received");
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const searchTerm = q.trim().toLowerCase();
    console.log("✅ Cleaned Search Term:", searchTerm);

    // ✅ Verify association first
    console.log("🧩 Checking Associations...");
    console.log("Products associations:", Object.keys(Products.associations));

    // ✅ Fetch data
    console.log("📦 Fetching products by category name...");
    const products = await Products.findAll({
      include: [
        {
          model: Category,
          as: "Category", // Make sure your association uses this alias
          attributes: ["id", "name"],
          where: {
            name: { [Op.iLike]: `%${searchTerm}%` },
          },
        },
        {
          model: Price,
          as: "price",
          attributes: ["purchase_price"],
        },
      ],
      attributes: ["id", "product_name", "category_id"],
      limit: 10,
    });

    console.log("✅ Raw Sequelize Result:", JSON.stringify(products, null, 2));

    if (!products || products.length === 0) {
      console.log("⚠️ No products found for category:", searchTerm);
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    console.log(`✅ Found ${products.length} product(s)`);
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("❌ Search Error:", error.message);
    console.error("🔍 Full Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
