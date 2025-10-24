import express from "express";
import {
  createVariation,
  getAllVariations,
  getVariationById,
  updateVariation,
  deleteVariation,
} from "../controller/variation.controller.js";
import { authorize } from "../middleware/accessControl.middleware.js";
import {verifyToken} from '../middleware/jwt.middleware.js'
const router = express.Router();

// Create Variation
router.post("/variation/create",verifyToken, authorize('create', 'product', 'any'), createVariation);        // POST   /api/variation/create

// Get all Variations
router.get("/variation/list",verifyToken, authorize('read','sale||product', 'any'), getAllVariations);          // GET    /api/variation/list

// Get Variation by ID
router.get("/variation/detail/:id",verifyToken, authorize('read', 'sale||product', 'any'), getVariationById);    // GET    /api/variation/detail/:id

// Update Variation
router.put("/variation/update/:id",verifyToken, authorize('update', 'product', 'any'), updateVariation);     // PUT    /api/variation/update/:id

// Delete Variation
router.delete("/variation/delete/:id",verifyToken, authorize('delete', 'product', 'any'), deleteVariation);  // DELETE /api/variation/delete/:id

export default router;
