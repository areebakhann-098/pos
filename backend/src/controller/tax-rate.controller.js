import TaxRate from "../model/tax-rate.model.js";
import { body, validationResult } from "express-validator";

// CREATE Tax Rate
export const createTaxRate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, amount, for_tax_group } = req.body;

    const taxRate = await TaxRate.create({
      name,
      amount,
      for_tax_group: for_tax_group || false,
    });

    return res.status(201).json({
      success: true,
      message: "Tax Rate created successfully",
      data: taxRate,
    });
  } catch (error) {
    console.error("Error creating Tax Rate:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET all Tax Rates
export const getTaxRates = async (req, res) => {
  try {
    const taxRates = await TaxRate.findAll();
    return res.status(200).json({ success: true, data: taxRates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET Tax Rate by ID
export const getTaxRateById = async (req, res) => {
  try {
    const taxRate = await TaxRate.findByPk(req.params.id);
    if (!taxRate) {
      return res.status(404).json({ success: false, message: "Tax Rate not found" });
    }
    return res.status(200).json({ success: true, data: taxRate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE Tax Rate
export const updateTaxRate = async (req, res) => {
  try {
    const { name, amount, for_tax_group } = req.body;

    const taxRate = await TaxRate.findByPk(req.params.id);
    if (!taxRate) {
      return res.status(404).json({ success: false, message: "Tax Rate not found" });
    }

    await taxRate.update({ name, amount, for_tax_group });

    return res.status(200).json({
      success: true,
      message: "Tax Rate updated successfully",
      data: taxRate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE Tax Rate
export const deleteTaxRate = async (req, res) => {
  try {
    const taxRate = await TaxRate.findByPk(req.params.id);
    if (!taxRate) {
      return res.status(404).json({ success: false, message: "Tax Rate not found" });
    }

    await taxRate.destroy();

    return res.status(200).json({ success: true, message: "Tax Rate deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  Validation rules
export const taxRateValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("amount")
    .isFloat({ min: 0 }).withMessage("Tax Rate must be a valid number"),
];
