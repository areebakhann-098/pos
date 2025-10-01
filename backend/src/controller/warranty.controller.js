import Warranty from "../model/warranty.model.js";
import { body, validationResult } from "express-validator";

// CREATE Warranty
export const createWarranty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, description, duration, duration_type } = req.body;

    const warranty = await Warranty.create({
      name,
     
      description,
      duration,
      duration_type,
    });

    return res.status(201).json({
      success: true,
      message: "Warranty created successfully",
      data: warranty,
    });
  } catch (error) {
    console.error("Error creating warranty:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET all Warranties
export const getWarranties = async (req, res) => {
  try {
    const warranties = await Warranty.findAll();
    return res.status(200).json({ success: true, data: warranties });
  } catch (error) {
    console.error("Error fetching warranties:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET Warranty by ID
export const getWarrantyById = async (req, res) => {
  try {
    const warranty = await Warranty.findByPk(req.params.id);
    if (!warranty)
      return res.status(404).json({ success: false, message: "Warranty not found" });

    return res.status(200).json({ success: true, data: warranty });
  } catch (error) {
    console.error("Error fetching warranty:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE Warranty
export const updateWarranty = async (req, res) => {
  try {
    const { name,  description, duration, duration_type } = req.body;

    const warranty = await Warranty.findByPk(req.params.id);
    if (!warranty)
      return res.status(404).json({ success: false, message: "Warranty not found" });

    await warranty.update({ name, business_id, description, duration, duration_type });

    return res.status(200).json({
      success: true,
      message: "Warranty updated successfully",
      data: warranty,
    });
  } catch (error) {
    console.error("Error updating warranty:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE Warranty
export const deleteWarranty = async (req, res) => {
  try {
    const warranty = await Warranty.findByPk(req.params.id);
    if (!warranty)
      return res.status(404).json({ success: false, message: "Warranty not found" });

    await warranty.destroy();
    return res.status(200).json({ success: true, message: "Warranty deleted successfully" });
  } catch (error) {
    console.error("Error deleting warranty:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Validation rules
export const warrantyValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("duration_type").isIn(["days", "months", "years"]).withMessage("Invalid duration type"),
];
