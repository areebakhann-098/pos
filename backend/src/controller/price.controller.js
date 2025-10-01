import Price from "../model/price.model.js";

// Create  Price
export const createPrice = async (req, res) => {
  try {
    const { profit_percent, purchase_price, sell_price, sell_price_with_tax } = req.body;

    const price = await Price.create({
      profit_percent,
      purchase_price,
      sell_price,
      sell_price_with_tax,
    });

    res.status(201).json({
      success: true,
      message: "Price created successfully",
      data: price,
    });
  } catch (error) {
    console.error("Error creating Price:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all  Prices
export const getAllPrices = async (req, res) => {
  try {
    const prices = await Price.findAll();
    res.status(200).json({ success: true, data: prices });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get  Price by ID
export const getPriceById = async (req, res) => {
  try {
    const price = await Price.findByPk(req.params.id);
    if (!price) {
      return res.status(404).json({ success: false, message: " Price not found" });
    }
    res.status(200).json({ success: true, data: price });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update  Price
export const updatePrice = async (req, res) => {
  try {
    const { profit_percent, purchase_price, sell_price, sell_price_with_tax } = req.body;
    const price = await Price.findByPk(req.params.id);

    if (!price) {
      return res.status(404).json({ success: false, message: " Price not found" });
    }

    await price.update({
      profit_percent,
      purchase_price,
      sell_price,
      sell_price_with_tax,
    });

    res.status(200).json({
      success: true,
      message: " Price updated successfully",
      data: price,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete  Price
export const deletePrice = async (req, res) => {
  try {
    const price = await Price.findByPk(req.params.id);
    if (!price) {
      return res.status(404).json({ success: false, message: " Price not found" });
    }

    await price.destroy();

    res.status(200).json({ success: true, message: " Price deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
