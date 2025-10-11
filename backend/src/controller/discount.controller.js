import Discount from "../model/discount.model.js";

// ✅ Create Discount
export const createDiscount = async (req, res) => {
  try {
    const { name, discount_type, discount_amount } = req.body;

    // Model ke hisaab se sirf ye 3 fields hain
    const discount = await Discount.create({
      name,
      discount_type,
      discount_amount,
    });

    res.status(201).json({
      success: true,
      message: "Discount created successfully",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll();
    res.status(200).json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Discount by ID
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);

    if (!discount) {
      return res
        .status(404)
        .json({ success: false, message: "Discount not found" });
    }

    res.status(200).json({ success: true, data: discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Discount
export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);

    if (!discount) {
      return res
        .status(404)
        .json({ success: false, message: "Discount not found" });
    }

    // Model ke fields ke hisaab se hi update karein
    const { name, discount_type, discount_amount } = req.body;

    await discount.update({
      name,
      discount_type,
      discount_amount,
    });

    res.status(200).json({
      success: true,
      message: "Discount updated successfully",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Discount
export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);

    if (!discount) {
      return res
        .status(404)
        .json({ success: false, message: "Discount not found" });
    }

    await discount.destroy();
    res
      .status(200)
      .json({ success: true, message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
