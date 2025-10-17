// controllers/saleReturn.controller.js
import Sale from "../model/sale.model.js";
import SaleItem from "../model/SaleItem.model.js";
import Products from "../model/products.model.js";
import Price from "../model/price.model.js";
import BusinessLocation from "../model/business-location.model.js";
import SaleReturn from "../model/saleReturn.model.js";
import SaleReturnItem from "../model/saleReturnItem.model.js";

export const createSaleReturn = async (req, res) => {
  const t = await SaleReturn.sequelize.transaction();
  try {
    const { sale_id, business_location_id, reason, products } = req.body;

    if (!products || products.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, error: "No products to return" });
    }

    // ✅ Check sale exists
    const sale = await Sale.findByPk(sale_id);
    if (!sale) {
      await t.rollback();
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    let totalRefund = 0;

    // ✅ Create SaleReturn
    const saleReturn = await SaleReturn.create(
      {
        sale_id,
        business_location_id,
        reason,
        total_refund_amount: 0,
      },
      { transaction: t }
    );

    // ✅ Loop through products to restore stock
    for (const item of products) {
      const { product_id, quantity } = item;

      const product = await Products.findByPk(product_id);
      if (!product) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, error: `Product not found: ${product_id}` });
      }

      const productPrice = await Price.findByPk(product.price_id, {
        attributes: ["sell_price"],
      });
      const refund = productPrice.sell_price * quantity;

      // 🧮 Update total refund
      totalRefund += refund;

      // 🔁 Restore stock
      product.quantity += quantity;
      await product.save({ transaction: t });

      // 🧾 Create SaleReturnItem
      await SaleReturnItem.create(
        {
          sale_return_id: saleReturn.id,
          product_id,
          quantity,
          refund_amount: refund,
        },
        { transaction: t }
      );
    }

    // ✅ Update total refund
    saleReturn.total_refund_amount = totalRefund;
    await saleReturn.save({ transaction: t });

    await t.commit();

    const returnData = await SaleReturn.findByPk(saleReturn.id, {
      include: [
        {
          model: BusinessLocation,
          as: "returnLocation",
          attributes: ["id", "name"],
        },
        { model: Sale, as: "originalSale", attributes: ["id", "final_amount"] },
        {
          model: SaleReturnItem,
          as: "returnItems",
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

    res.status(201).json({ success: true, data: returnData });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("❌ Error creating sale return:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ GET all returns
export const getAllSaleReturns = async (req, res) => {
  try {
    const returns = await SaleReturn.findAll({
      include: [
        {
          model: Sale,
          as: "originalSale",
          attributes: ["id", "sale_date", "total_items", "amount_paid"],
        },
        { model: BusinessLocation, as: "returnLocation", attributes: ["name"] },
        {
          model: SaleReturnItem,
          as: "returnItems",
          attributes: ["refund_amount",  "quantity"],
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["product_name"],
            },
          ],
        },
      ],
    });
    res.status(200).json({ success: true, data: returns });
  } catch (error) {
    console.error("❌ Error fetching sale returns:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
