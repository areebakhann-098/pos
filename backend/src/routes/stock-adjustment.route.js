import express from "express";
import {
  createStockAdjustment,
  getAllStockAdjustments,
  getStockAdjustmentById,
  updateStockAdjustment,
  deleteStockAdjustment,
  searchProducts
} from "../controller/stock-adjustment.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
const router = express.Router();

router.post("/stockadjustment/create", verifyToken,authorize('create', 'product', 'any'),createStockAdjustment);
router.get("/stockadjustment/list", verifyToken,authorize('read', 'product', 'any'), getAllStockAdjustments);
router.get("/stockadjustment/list/:id", verifyToken,authorize('read', 'product', 'any'), getStockAdjustmentById);
router.put("/stockadjustment/update/:id",verifyToken,authorize('update', 'product', 'any'), updateStockAdjustment);
router.delete("/stockadjustment/delete/:id",verifyToken,authorize('delete', 'product', 'any'), deleteStockAdjustment);
router.get("/stockadjustment/search-products", verifyToken,authorize('read', 'product||sale', 'any'),searchProducts);


export default router;
