import express from "express";
import {
  createWarranty,
  getWarranties,
  getWarrantyById,
  updateWarranty,
  deleteWarranty,
  warrantyValidation,
} from "../controller/warranty.controller.js";
import { authorize } from "../middleware/accessControl.middleware.js";
import {verifyToken} from '../middleware/jwt.middleware.js'
const router = express.Router();

// Create warranty
router.post("/warranties/create", warrantyValidation, verifyToken, authorize('create', 'product', 'any'), createWarranty);

// Get all warranties
router.get("/warranties/list", verifyToken, authorize('read', 'product||sale', 'any'), getWarranties);

// Get warranty by ID
router.get("/warranties/:id", verifyToken, authorize('read', 'product||sale', 'any'), getWarrantyById);

// Update warranty
router.put("/warranties/:id", warrantyValidation,verifyToken,  authorize('update', 'product', 'any'), updateWarranty);

// Delete warranty
router.delete("/warranties/delete/:id", verifyToken, authorize('delete', 'product', 'any'), deleteWarranty);


export default router;
