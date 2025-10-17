import Sale from "../model/sale.model.js";
import BusinessLocation from "../model/business-location.model.js";
import Discount from "../model/discount.model.js";
import TaxRate from "../model/tax-rate.model.js";
import Products from "../model/products.model.js";
import Price from "../model/price.model.js";
import SaleItem from "../model/SaleItem.model.js";


// =============================
// CREATE SALE (with stock update)
// =============================
export const createSale = async (req, res) => {
  const t = await Sale.sequelize.transaction();
  try {
    const {
      sale_date,
      business_location_id,
      total_items,
      total_amount,
      discount_id,
      tax_id,
      final_amount,
      payment_method,
      amount_paid,
      products, // 👈 array of products
    } = req.body;

    if (!products || products.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, error: "No products selected" });
    }

    // ✅ Create Sale first
    const sale = await Sale.create(
      {
        sale_date,
        business_location_id,
        total_items,
        total_amount,
        discount_id,
        tax_id,
        final_amount,
        payment_method,
        amount_paid,
      },
      { transaction: t }
    );

    // ✅ Loop through products
    for (const item of products) {
      const { product_id, quantity } = item;

      const product = await Products.findByPk(product_id);
      if (!product) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, error: `Product not found: ${product_id}` });
      }

      if (product.quantity < quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: `Not enough stock for product ${product.product_name}`,
        });
      }

      // ✅ get price using product.price_id
      const productPrice = await Price.findByPk(product.price_id, {
        attributes: ["sell_price"],
      });

      if (!productPrice) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: `No price found for product ${product.product_name}`,
        });
      }

      // ✅ Subtract stock
      product.quantity -= quantity;
      await product.save({ transaction: t });

      // ✅ Create SaleItem
      await SaleItem.create(
        {
          sale_id: sale.id,
          product_id,
          quantity,
          price: productPrice.sell_price,
        },
        { transaction: t }
      );
    }

    await t.commit();

    // ✅ Fetch associations
    const saleWithAssociations = await Sale.findByPk(sale.id, {
      include: [
        {
          model: BusinessLocation,
          as: "saleBusinessLocation",
          attributes: ["id", "name"],
        },
        {
          model: Discount,
          as: "saleDiscount",
          attributes: ["id", "name", "discount_amount"],
        },
        { model: TaxRate, as: "saleTax", attributes: ["id", "name"] },
        {
          model: SaleItem,
          as: "saleItems",
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["id", "product_name"],
              include: [
                { model: Price, as: "price", attributes: ["id", "sell_price"] },
              ],
            },
          ],
        },
      ],
    });

    res.status(201).json({ success: true, data: saleWithAssociations });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }
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
        {
          model: BusinessLocation,
          as: "saleBusinessLocation",
          attributes: ["id", "name"],
        },
        {
          model: Discount,
          as: "saleDiscount",
          attributes: ["id", "discount_amount", "name"],
        },
        { model: TaxRate, as: "saleTax", attributes: ["id", "name"] },
        {
          model: SaleItem,
          as: "saleItems",
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["id", "product_name"],
            },
          ],
        },
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
        { model: BusinessLocation, as: "saleBusinessLocation" },
        {
          model: Discount,
          as: "saleDiscount",
          attributes: ["id", "name", "discount_amount"],
        },
        { model: TaxRate, as: "saleTax", attributes: ["id", "name"] },
        {
          model: SaleItem,
          as: "saleItems",
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["id", "product_name"],
            },
          ],
        },
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

    const updatedSale = await Sale.findByPk(id, {
      include: [
        { model: BusinessLocation, as: "saleBusinessLocation" },
        { model: Discount, as: "saleDiscount" },
        { model: TaxRate, as: "saleTax" },
        {
          model: SaleItem,
          as: "saleItems",
          include: [{ model: Products, as: "product" }],
        },
      ],
    });

    res.status(200).json({ success: true, data: updatedSale });
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

    res
      .status(200)
      .json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting sale:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
