import express from "express";
import {
  createVariation,
  getAllVariations,
  getVariationById,
  updateVariation,
  deleteVariation,
} from "../controller/variation.controller.js";

const router = express.Router();

// Create Variation
router.post("/variation/create", createVariation);        // POST   /api/variation/create

// Get all Variations
router.get("/variation/list", getAllVariations);          // GET    /api/variation/list

// Get Variation by ID
router.get("/variation/detail/:id", getVariationById);    // GET    /api/variation/detail/:id

// Update Variation
router.put("/variation/update/:id", updateVariation);     // PUT    /api/variation/update/:id

// Delete Variation
router.delete("/variation/delete/:id", deleteVariation);  // DELETE /api/variation/delete/:id

export default router;
