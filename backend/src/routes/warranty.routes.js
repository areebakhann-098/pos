import express from "express";
import {
  createWarranty,
  getWarranties,
  getWarrantyById,
  updateWarranty,
  deleteWarranty,
  warrantyValidation,
} from "../controller/warranty.controller.js";

const router = express.Router();

// Create warranty
router.post("/warranties", warrantyValidation, createWarranty);

// Get all warranties
router.get("/warranties", getWarranties);

// Get warranty by ID
router.get("/warranties/:id", getWarrantyById);

// Update warranty
router.put("/warranties/:id", warrantyValidation, updateWarranty);

// Delete warranty
router.delete("/warranties/:id", deleteWarranty);

export default router;
